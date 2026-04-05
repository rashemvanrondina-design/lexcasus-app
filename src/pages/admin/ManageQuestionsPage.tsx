import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { 
  Plus, Search, Edit2, Trash2, Loader2, BookOpen, 
  UploadCloud, FileText, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Define the Bar Question Structure
interface BarQuestion {
  id: string;
  title: string;
  year: string;
  topic: string;
  question: string;
  suggestedAnswer: string;
}

const ManageQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<BarQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentQ, setCurrentQ] = useState<Partial<BarQuestion>>({});
  
  // Bulk Upload State
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'bar_questions'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BarQuestion[];
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Save Single Question
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentQ.id) {
        await updateDoc(doc(db, 'bar_questions', currentQ.id), currentQ);
      } else {
        await addDoc(collection(db, 'bar_questions'), currentQ);
      }
      setIsModalOpen(false);
      fetchQuestions();
    } catch (error) {
      alert("Failed to save question.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Question
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this Bar Question permanently?")) return;
    try {
      await deleteDoc(doc(db, 'bar_questions', id));
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      alert("Failed to delete.");
    }
  };

  // 🟢 AMENDED: BULK TXT UPLOAD (Multi-Question Support)
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkUploading(true);
    let totalQuestionsCount = 0;

    const batch = writeBatch(db);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fullText = await file.text();
      
      // 1. Split the file by the delimiter '###'
      const rawBlocks = fullText.split('###');
      
      // 2. Filter out empty blocks (in case of extra spaces at the end of file)
      const questionBlocks = rawBlocks.filter(block => block.trim().length > 0);
      
      const fileNameLabel = file.name.replace(/\.[^/.]+$/, ""); 

      questionBlocks.forEach((block, index) => {
        // 3. For each block, find the Answer
        let parsedQuestion = block.trim();
        let parsedAnswer = "";
        
        if (block.includes("ANSWER:") || block.includes("Answer:")) {
          const parts = block.split(/ANSWER:|Answer:/);
          parsedQuestion = parts[0].trim();
          parsedAnswer = parts[1].trim();
        }

        // 4. Prepare for Firestore
        const newDocRef = doc(collection(db, 'bar_questions'));
        batch.set(newDocRef, {
          // Use filename + index if there are multiple (e.g., "Civil Law - Q1")
          title: questionBlocks.length > 1 ? `${fileNameLabel} - Q${index + 1}` : fileNameLabel,
          year: new Date().getFullYear().toString(),
          topic: fileNameLabel, // Auto-set topic as the filename (e.g., "Civil Law")
          question: parsedQuestion,
          suggestedAnswer: parsedAnswer,
          createdAt: new Date().toISOString()
        });
        
        totalQuestionsCount++;
      });
    }

    try {
      await batch.commit();
      alert(`Success! Successfully uploaded ${totalQuestionsCount} questions across ${files.length} files.`);
      fetchQuestions();
    } catch (error) {
      console.error("Bulk upload failed:", error);
      alert("Error committing to database.");
    } finally {
      setIsBulkUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.title?.toLowerCase().includes(search.toLowerCase()) ||
    q.topic?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-gold-500" /> Manage Bar Questions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add, edit, or bulk upload mock bar exam questions.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* 🟢 Bulk Upload Button */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            accept=".txt" 
            multiple 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isBulkUploading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gold-500 text-gold-600 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-500/10 font-bold text-sm transition-all disabled:opacity-50"
          >
            {isBulkUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {isBulkUploading ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` : 'Bulk Upload .TXT'}
          </button>

          <button 
            onClick={() => { setCurrentQ({}); setIsModalOpen(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm transition-all shadow-lg shadow-gold-500/20"
          >
            <Plus className="w-4 h-4" /> Add Manual
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search questions by title or topic..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Question List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gold-500" /></div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-800">
          <FileText className="w-12 h-12 text-gray-300 dark:text-navy-700 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No bar questions found in the database.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-gray-200 dark:border-navy-700 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-gold-500/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 rounded text-xs font-bold">{q.year}</span>
                  <span className="px-2 py-1 bg-gold-100 dark:bg-gold-500/10 text-gold-700 dark:text-gold-400 rounded text-xs font-bold">{q.topic}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{q.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{q.question}</p>
              </div>
              <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setCurrentQ(q); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(q.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-white dark:bg-navy-950 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-navy-800 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-navy-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentQ.id ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title / Subject</label>
                  <input required type="text" value={currentQ.title || ''} onChange={e => setCurrentQ({...currentQ, title: e.target.value})} className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white" placeholder="e.g., 2019 Bar - Political Law" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Year</label>
                    <input required type="text" value={currentQ.year || ''} onChange={e => setCurrentQ({...currentQ, year: e.target.value})} className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white" placeholder="2019" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                    <input required type="text" value={currentQ.topic || ''} onChange={e => setCurrentQ({...currentQ, topic: e.target.value})} className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white" placeholder="Consti Law" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">The Question</label>
                <textarea required rows={5} value={currentQ.question || ''} onChange={e => setCurrentQ({...currentQ, question: e.target.value})} className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white resize-none" placeholder="Paste the full question here..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Suggested Answer (Optional)</label>
                <textarea rows={5} value={currentQ.suggestedAnswer || ''} onChange={e => setCurrentQ({...currentQ, suggestedAnswer: e.target.value})} className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white resize-none" placeholder="Paste the suggested answer here..."></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl transition-all shadow-lg shadow-gold-500/20 flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageQuestionsPage;
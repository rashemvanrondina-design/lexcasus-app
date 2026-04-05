import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  Shield,
  FileText,
  Scale,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DisclaimerSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string;
}

const privacySections: DisclaimerSection[] = [
  {
    id: 'collection',
    title: 'Data Collection',
    icon: Database,
    content: `LexCasus collects and processes the following types of personal data to provide and improve our services:

• **Account Information**: Name, email address, and profile details (age, university, state, college) that you voluntarily provide during registration.
• **Usage Data**: Information about how you interact with our platform, including pages visited, features used, and time spent on the platform.
• **Content Data**: Legal notes, practice answers, and case digests you create or generate using our services.
• **Payment Information**: Subscription plan details and billing records. Note: LexCasus uses GCash verification and third-party gateways; we do not store direct bank credentials.

All data collection is performed with your knowledge and consent. You may decline to provide certain optional information, though this may limit access to some features.`,
  },
  {
    id: 'usage',
    title: 'Data Usage',
    icon: Eye,
    content: `Your personal data is used for the following purposes:

• **Service Delivery**: To provide, maintain, and improve LexCasus's legal study tools, AI features, and personalized dashboard experience.
• **Account Management**: To manage your account, process subscriptions, and provide customer support.
• **AI-Powered Features**: Your practice answers and legal queries may be processed by our AI systems to provide feedback, generate case digests, and deliver legal chat responses.
• **Communication**: To send service-related notifications, account updates, and respond to your inquiries.
• **Analytics**: To analyze usage patterns and improve our platform's performance and user experience.
• **Legal Compliance**: To comply with applicable laws, regulations, and legal processes.

LexCasus will not sell, rent, or share your personal data with third parties for marketing purposes without your explicit consent.`,
  },
  {
    id: 'storage',
    title: 'Data Storage & Security',
    icon: Lock,
    content: `We implement industry-standard security measures to protect your personal data:

• **Encryption**: All data is encrypted in transit using TLS 1.3 and at rest.
• **Access Control**: Role-based access control (RBAC) ensures that only authorized personnel can access user data. Admin access is strictly limited to designated administrators.
• **Data Retention**: Your data is retained for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time.
• **Secure Infrastructure**: Our platform data is hosted on secure, industry-compliant cloud infrastructure (Firebase/Supabase).

While we strive to protect your personal information, no method of transmission over the Internet is 100% secure. LexCasus is not liable for unauthorized access resulting from factors beyond our control.`,
  },
  {
    id: 'rights',
    title: 'Your Rights',
    icon: UserCheck,
    content: `Under the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines, you have the following rights:

• **Right to Access**: You may request a copy of the personal data we hold about you.
• **Right to Correction**: You may update or correct inaccurate or incomplete personal data through your profile settings or by contacting us.
• **Right to Deletion**: You may request the deletion of your personal data, subject to legal retention requirements.
• **Right to Object**: You may object to the processing of your personal data for specific purposes.
• **Right to Data Portability**: You may request your data in a structured, commonly used, machine-readable format.
• **Right to Withdraw Consent**: You may withdraw your consent for data processing at any time, though this may affect your ability to use certain services.

To exercise any of these rights, please contact our Data Protection Officer at lexcasus@gmail.com.`,
  },
];

const termsSections: DisclaimerSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: FileText,
    content: `By accessing or using the LexCasus platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must not use the Service.

These Terms constitute a legally binding agreement between you ("User", "Atty.", "Client") and LexCasus ("Platform", "We", "Us"). We reserve the right to modify these Terms at any time. Continued use of the Service after modifications constitutes acceptance of the updated Terms.

LexCasus is designed for educational and study purposes only and does not constitute legal advice. All AI-generated content should be verified against official legal sources before use in professional practice.`,
  },
  {
    id: 'services',
    title: 'Service Description',
    icon: Scale,
    content: `LexCasus provides the following features, subject to your subscription plan:

• **Legal Chat AI**: AI-powered legal research assistant specializing in Philippine law.
• **Practice Bar AI**: AI-evaluated Bar exam practice with structured ALAC feedback.
• **Case Digest Generator**: AI-powered generation of case digests from Supreme Court jurisprudence.
• **E-Codals**: Digital codal provisions with AI Deconstruction capabilities.
• **Notes System**: Rich text folders and notes with case/provision linking.

Feature limits (e.g., daily query caps) are determined by your current subscription tier (Free, Premium, or Premium+). The Admin reserves the right to modify, suspend, or discontinue any feature with reasonable notice.`,
  },
  {
    id: 'subscription',
    title: 'Subscription & Billing',
    icon: FileText,
    content: `• **Plans**: LexCasus offers Free (₱0), Premium (₱199/month), and Premium+ (₱599/month) subscription tiers.
• **Billing**: Subscriptions are billed monthly. Prices are in Philippine Pesos (₱) and are subject to change with prior notice.
• **Plan Changes**: You may upgrade or downgrade your plan at any time. GCash upgrades require manual verification of the Proof of Payment sent to lexcasus@gmail.com.
• **Refund Policy**: Subscription fees are generally non-refundable. Requests for exceptions may be submitted for review.
• **Admin Override**: The platform administrator may manually assign, modify, or revoke subscription plans. Such changes supersede automated billing processes.`,
  },
  {
    id: 'limitations',
    title: 'Limitations & Disclaimers',
    icon: AlertTriangle,
    content: `• **Not Legal Advice**: LexCasus is an educational tool and does not provide legal advice. AI-generated content, case digests, and legal analysis are for study purposes only and should not be relied upon as authoritative legal opinions.
• **Accuracy**: While we strive for accuracy, AI-generated content may contain errors, inaccuracies, or hallucinations. Always verify against official sources, codal provisions, and published jurisprudence.
• **No Attorney-Client Relationship**: Use of LexCasus does not create an attorney-client relationship between you and the platform.
• **Availability**: The Service is provided "as is" and "as available." We do not guarantee uninterrupted, error-free, or secure operation of the platform.
• **Liability Limitation**: To the maximum extent permitted by law, LexCasus shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of the Service.`,
  },
];

const DisclaimerPage: React.FC = () => {
  const [expandedPrivacy, setExpandedPrivacy] = useState<string | null>('collection');
  const [expandedTerms, setExpandedTerms] = useState<string | null>('acceptance');
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  const sections = activeTab === 'privacy' ? privacySections : termsSections;
  const expanded = activeTab === 'privacy' ? expandedPrivacy : expandedTerms;
  const setExpanded = activeTab === 'privacy' ? setExpandedPrivacy : setExpandedTerms;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-navy-100 dark:bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-navy-600 dark:text-gold-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Disclaimer</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Data Privacy Policy and Terms & Conditions
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-navy-800 rounded-xl">
        <button
          onClick={() => setActiveTab('privacy')}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
            activeTab === 'privacy'
              ? 'bg-white dark:bg-navy-900 text-navy-800 dark:text-gold-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Lock className="w-4 h-4 inline mr-1.5" />
          Data Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
            activeTab === 'terms'
              ? 'bg-white dark:bg-navy-900 text-navy-800 dark:text-gold-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <FileText className="w-4 h-4 inline mr-1.5" />
          Terms & Conditions
        </button>
      </div>

      {/* Effective Date */}
      <div className="card p-3 bg-gold-50 dark:bg-gold-500/5 border-gold-200 dark:border-gold-500/20 text-center">
        <p className="text-xs text-gold-700 dark:text-gold-400">
          Last updated: April 2026 • Effective Date: April 2026
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isOpen = expanded === section.id;
          return (
            <div key={section.id} className="card overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-navy-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center',
                    isOpen
                      ? 'bg-gold-100 dark:bg-gold-500/10'
                      : 'bg-gray-100 dark:bg-navy-800'
                  )}>
                    <section.icon className={cn(
                      'w-4 h-4',
                      isOpen
                        ? 'text-gold-600 dark:text-gold-400'
                        : 'text-gray-500 dark:text-gray-400'
                    )} />
                  </div>
                  <span className={cn(
                    'text-sm font-semibold text-left',
                    isOpen
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  )}>
                    {section.title}
                  </span>
                </div>
                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-navy-800 pt-4 animate-fade-in">
                  <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <div className="card p-5 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          For questions about this policy or to exercise your data privacy rights, contact us at:
        </p>
        <p className="text-sm font-medium text-navy-700 dark:text-gold-400 mt-2">
          lexcasus@gmail.com
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Data Protection Officer, LexCasus Philippines
        </p>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center p-4 rounded-xl bg-navy-50 dark:bg-navy-900/50 border border-navy-200 dark:border-navy-800">
        <AlertTriangle className="w-5 h-5 text-gold-500 mx-auto mb-2" />
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-700 dark:text-gray-300">Important Disclaimer:</strong> LexCasus is an AI-powered educational tool designed for law students and legal practitioners. 
          All AI-generated content, including case digests, legal analysis, and practice evaluations, are for <strong>study and reference purposes only</strong>. 
          They do not constitute legal advice and should not be used as a substitute for professional legal counsel. 
          Always verify information against official codal provisions, published Supreme Court decisions, and other authoritative legal sources.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerPage;
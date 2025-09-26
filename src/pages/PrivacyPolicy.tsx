import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  FileText, 
  Mail, 
  Cookie,
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Building,
  Clock,
  Phone
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { privacyManager } from '../lib/privacy-manager';

const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('');
  const [showDataRequestForm, setShowDataRequestForm] = useState(false);
  const [requestType, setRequestType] = useState<'access' | 'delete' | 'portability' | 'rectification'>('access');
  const [userEmail, setUserEmail] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    // Intersection observer for active section highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleDataRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const id = await privacyManager.submitDataRequest(requestType, userEmail);
      setRequestId(id);
      setRequestSubmitted(true);
      setShowDataRequestForm(false);
    } catch (error) {
      alert('Failed to submit request. Please try again or contact us directly.');
    }
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: Shield },
    { id: 'data-collection', title: 'Data Collection', icon: Database },
    { id: 'legal-basis', title: 'Legal Basis', icon: FileText },
    { id: 'your-rights', title: 'Your Rights', icon: UserCheck },
    { id: 'cookies', title: 'Cookies', icon: Cookie },
    { id: 'data-security', title: 'Data Security', icon: Lock },
    { id: 'retention', title: 'Data Retention', icon: Clock },
    { id: 'international', title: 'International Transfers', icon: Globe },
    { id: 'contact', title: 'Contact & DPO', icon: Mail },
  ];

  const dataRights = [
    {
      title: 'Right of Access',
      description: 'Get a copy of all personal data we hold about you',
      icon: Eye,
      action: 'access',
      article: 'Article 15 GDPR',
    },
    {
      title: 'Right to Rectification',
      description: 'Correct any inaccurate or incomplete personal data',
      icon: RefreshCw,
      action: 'rectification',
      article: 'Article 16 GDPR',
    },
    {
      title: 'Right to be Forgotten',
      description: 'Request deletion of your personal data',
      icon: Trash2,
      action: 'delete',
      article: 'Article 17 GDPR',
    },
    {
      title: 'Right to Data Portability',
      description: 'Receive your data in a machine-readable format',
      icon: Download,
      action: 'portability',
      article: 'Article 20 GDPR',
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy & GDPR Compliance</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your privacy is our priority. This policy explains how we collect, use, and protect your personal data 
              in compliance with GDPR and German data protection laws.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="bg-blue-500/30 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
                GDPR Compliant
              </span>
              <span className="bg-blue-500/30 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
                BDSG Compliant
              </span>
              <span className="bg-blue-500/30 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
                SOC2 Ready
              </span>
              <span className="bg-blue-500/30 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
                Last Updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contents</h3>
                <ul className="space-y-2">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className={`flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors ${
                            activeSection === section.id
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{section.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Overview */}
            <section id="overview" data-section className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Overview</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 mb-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">GDPR Compliance Commitment</h3>
                      <p className="text-blue-800 dark:text-blue-200">
                        EA Solutions is fully committed to GDPR compliance and your data protection rights. 
                        We implement privacy-by-design principles and maintain the highest standards of data security.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      icon: Shield,
                      title: 'Privacy by Design',
                      description: 'Data protection is built into every system and process from the ground up.',
                    },
                    {
                      icon: Lock,
                      title: 'Secure Processing',
                      description: 'All data is encrypted in transit and at rest with industry-standard protocols.',
                    },
                    {
                      icon: UserCheck,
                      title: 'Your Rights',
                      description: 'Full control over your personal data with easy-to-use rights management.',
                    },
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                      </div>
                    );
                  })}
                </div>

                <p className="text-gray-700 dark:text-gray-300">
                  This privacy policy applies to all services provided by EA Solutions, including our website, 
                  mobile applications, and any software solutions we provide to our clients. We are committed to 
                  transparency in our data processing activities and your right to control your personal information.
                </p>
              </div>
            </section>

            {/* Data Collection */}
            <section id="data-collection" data-section className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Data Collection</h2>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information We Collect</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h4>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                        <li>Name and contact information (email, phone, address)</li>
                        <li>Company information and job title</li>
                        <li>Account credentials and authentication data</li>
                        <li>Communication history and support interactions</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technical Information</h4>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                        <li>IP address and location data (anonymized)</li>
                        <li>Browser type, version, and device information</li>
                        <li>Usage patterns and interaction data</li>
                        <li>Performance and error logs</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Optional Information</h4>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                        <li>Marketing preferences and communication choices</li>
                        <li>Survey responses and feedback</li>
                        <li>Social media profiles (if connected)</li>
                        <li>Event attendance and participation data</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Data Minimization Principle</h3>
                      <p className="text-yellow-800 dark:text-yellow-200">
                        We only collect data that is necessary for our services. You can control what information 
                        you share and update your preferences at any time through your account settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Legal Basis */}
            <section id="legal-basis" data-section className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Legal Basis for Processing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Consent',
                    description: 'Marketing communications, analytics cookies, and optional features',
                    article: 'Article 6(1)(a) GDPR',
                    icon: UserCheck,
                  },
                  {
                    title: 'Contract',
                    description: 'Service delivery, account management, and customer support',
                    article: 'Article 6(1)(b) GDPR',
                    icon: FileText,
                  },
                  {
                    title: 'Legitimate Interest',
                    description: 'Website security, fraud prevention, and service improvement',
                    article: 'Article 6(1)(f) GDPR',
                    icon: Shield,
                  },
                  {
                    title: 'Legal Obligation',
                    description: 'Tax records, compliance reporting, and legal requirements',
                    article: 'Article 6(1)(c) GDPR',
                    icon: Building,
                  },
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start space-x-3 mb-4">
                        <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{item.article}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Your Rights */}
            <section id="your-rights" data-section className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Data Protection Rights</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                Under GDPR, you have comprehensive rights regarding your personal data. You can exercise these rights 
                free of charge, and we will respond within 30 days.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {dataRights.map((right, index) => {
                  const IconComponent = right.icon;
                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{right.title}</h3>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{right.article}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setRequestType(right.action as any);
                            setShowDataRequestForm(true);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          Request
                        </button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{right.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">Exercise Your Rights</h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  Ready to exercise your data protection rights? Click below to submit a request, and we'll guide you through the process.
                </p>
                <button
                  onClick={() => setShowDataRequestForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Submit Data Request
                </button>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" data-section className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contact & Data Protection Officer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Data Controller</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">EA Solutions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <a href="mailto:ali.h@easolutions.de" className="text-blue-600 dark:text-blue-400 hover:underline">
                        ali.h@easolutions.de
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Wiesbaden, Germany</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Privacy Rights</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    For any privacy-related questions or to exercise your data protection rights, 
                    contact us using the information provided or submit a request through our automated system.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Response time: Within 30 days</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>No fees for standard requests</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Supervisory Authority</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  You have the right to lodge a complaint with the competent supervisory authority:
                </p>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p><strong>Der Hessische Beauftragte für Datenschutz und Informationsfreiheit</strong></p>
                  <p>Postfach 3163, 65021 Wiesbaden, Germany</p>
                  <p>Email: poststelle@datenschutz.hessen.de</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Data Request Modal */}
      {showDataRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Submit Data Request</h3>
              <form onSubmit={handleDataRequest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Request Type
                    </label>
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="access">Data Access (Article 15)</option>
                      <option value="rectification">Data Rectification (Article 16)</option>
                      <option value="delete">Data Deletion (Article 17)</option>
                      <option value="portability">Data Portability (Article 20)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You will receive a confirmation email to verify this request.
                  </p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDataRequestForm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {requestSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Submitted</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your data request has been submitted successfully. Please check your email for confirmation instructions.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Request ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{requestId}</code>
              </p>
              <button
                onClick={() => setRequestSubmitted(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicy;
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Key, 
  Activity, 
  Zap, 
  Shield, 
  Globe, 
  Smartphone, 
  Home,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  Play,
  Pause,
  AlertTriangle,
  DollarSign,
  Users,
  BarChart3,
  Webhook,
  Settings,
  BookOpen,
  Lightbulb,
  Rocket,
  Clock,
  Target
} from 'lucide-react';

const DeveloperPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState('/ai/chat');
  const [testResponse, setTestResponse] = useState(null);
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [userTier, setUserTier] = useState('free');
  const [usageData, setUsageData] = useState(null);
  
  const codeRef = useRef(null);

  // Mock API usage data
  const mockUsageData = {
    free: {
      current: 47,
      limit: 100,
      percentage: 47,
      tier: 'Free',
      monthlyFee: 0,
      callsIncluded: 100,
      overageRate: 0.10
    },
    starter: {
      current: 2847,
      limit: 10000,
      percentage: 28.47,
      tier: 'Starter',
      monthlyFee: 99,
      callsIncluded: 10000,
      overageRate: 0.015
    },
    growth: {
      current: 34521,
      limit: 100000,
      percentage: 34.52,
      tier: 'Growth', 
      monthlyFee: 499,
      callsIncluded: 100000,
      overageRate: 0.01
    }
  };

  const endpoints = {
    '/ai/chat': {
      name: 'AI Chat Intelligence',
      description: 'Same AI powering KFC\'s customer service globally',
      method: 'POST',
      price: '€0.02/call',
      response_time: '< 200ms',
      example: {
        request: {
          "message": "How can I optimize my restaurant operations like KFC?",
          "context": {"business_type": "restaurant"},
          "language": "en"
        },
        response: {
          "success": true,
          "response": "Based on KFC's optimization strategies that we implemented...",
          "confidence_score": 0.95,
          "response_time_ms": 142
        }
      }
    },
    '/ai/analyze': {
      name: 'Document Analysis API',
      description: 'KFC processes 1000+ documents daily with this API',
      method: 'POST', 
      price: '€0.05/call',
      response_time: '< 500ms',
      example: {
        request: {
          "content": "Customer feedback: The new system is incredible!",
          "analysis_type": ["sentiment", "opportunities"]
        },
        response: {
          "success": true,
          "analysis": {
            "sentiment": {"score": 0.9, "label": "positive"},
            "opportunities": ["Customer satisfaction improvement"]
          }
        }
      }
    },
    '/smart-home/assistant': {
      name: 'Local AI Assistant',
      description: '100% local, privacy-first smart home control',
      method: 'POST',
      price: '€0.001/call',
      response_time: '< 50ms',
      example: {
        request: {
          "command": "Turn on living room lights and set temperature to 22°C"
        },
        response: {
          "success": true,
          "response": "Living room lights are now on and temperature set to 22°C",
          "processing_time_ms": 47
        }
      }
    },
    '/automation/booking': {
      name: 'Intelligent Booking API',
      description: 'Smart booking with dynamic pricing and AI optimization',
      method: 'POST',
      price: '€0.15/call',
      response_time: '< 300ms',
      example: {
        request: {
          "service_type": "consultation",
          "preferred_date": "2024-12-20",
          "customer_info": {"name": "John Doe", "email": "john@company.com"}
        },
        response: {
          "success": true,
          "booking_id": "BOOK-2024-1234567",
          "total_price": 299.00
        }
      }
    }
  };

  const tiers = [
    {
      name: 'Free',
      price: '€0',
      calls: '100/month',
      features: ['Basic AI chat', 'Community support', 'Standard rate limits'],
      highlight: false,
      ctaText: 'Current Plan',
      savings: null
    },
    {
      name: 'Starter', 
      price: '€99',
      calls: '10,000/month',
      features: ['All AI endpoints', 'Email support', 'Webhooks', 'Analytics'],
      highlight: true,
      ctaText: 'Upgrade Now - Save 85%',
      savings: 'vs €1,000 overage cost'
    },
    {
      name: 'Growth',
      price: '€499', 
      calls: '100,000/month',
      features: ['Advanced AI', 'Priority support', 'Custom prompts', 'SLA 99.5%'],
      highlight: false,
      ctaText: 'Scale Up',
      savings: 'vs €5,000 overage cost'
    }
  ];

  const quickStartExamples = {
    curl: `curl -X POST https://api.ea-s.info/v2/ai/chat \\
  -H "X-API-Key: ${apiKey || 'your_api_key_here'}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(endpoints[selectedEndpoint].example.request, null, 2)}'`,
    
    javascript: `const response = await fetch('https://api.ea-s.info/v2${selectedEndpoint}', {
  method: '${endpoints[selectedEndpoint].method}',
  headers: {
    'X-API-Key': '${apiKey || 'your_api_key_here'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${JSON.stringify(endpoints[selectedEndpoint].example.request, null, 2)})
});
const data = await response.json();`,

    python: `import requests

response = requests.post('https://api.ea-s.info/v2${selectedEndpoint}', 
  headers={'X-API-Key': '${apiKey || 'your_api_key_here'}'},
  json=${JSON.stringify(endpoints[selectedEndpoint].example.request, null, 2)}
)
data = response.json()`
  };

  // Generate API key
  const generateApiKey = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newKey = `eas_demo_${userTier}_${Math.random().toString(36).substr(2, 15)}`;
      setApiKey(newKey);
      setIsGenerating(false);
      
      // Show success message
      setTestResponse({
        type: 'success',
        message: 'API key generated successfully! You now have access to the EA-S API ecosystem.'
      });
    }, 1500);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Test API endpoint
  const testEndpoint = async () => {
    if (!apiKey) {
      setTestResponse({
        type: 'error',
        message: 'Please generate an API key first'
      });
      return;
    }

    setIsTestingAPI(true);
    
    // Simulate API call
    setTimeout(() => {
      setTestResponse({
        type: 'success',
        message: 'API call successful!',
        data: endpoints[selectedEndpoint].example.response,
        responseTime: Math.floor(Math.random() * 200) + 50
      });
      setIsTestingAPI(false);
    }, 1200);
  };

  // Get current usage data
  useEffect(() => {
    setUsageData(mockUsageData[userTier]);
  }, [userTier]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'quickstart', label: 'Quick Start', icon: Rocket },
    { id: 'endpoints', label: 'API Reference', icon: Code },
    { id: 'keys', label: 'API Keys', icon: Key },
    { id: 'usage', label: 'Usage & Billing', icon: BarChart3 },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold text-white">EA-S Developer Portal</span>
              </div>
              <div className="text-sm text-slate-400">
                The same APIs powering KFC's global operations
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-300">
                Current Plan: <span className="text-blue-400 font-semibold">{usageData?.tier}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            
            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-3">Usage This Month</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">API Calls</span>
                    <span className="text-white">{usageData?.current.toLocaleString()} / {usageData?.limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(usageData?.percentage || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {usageData?.percentage >= 80 ? (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <AlertTriangle className="w-3 h-3" />
                      Consider upgrading soon
                    </div>
                  ) : (
                    'Looking good!'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Hero Section */}
                  <div className="text-center py-12 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl border border-slate-700">
                    <h1 className="text-4xl font-bold text-white mb-4">
                      Build with EA-S APIs
                    </h1>
                    <p className="text-xl text-slate-300 mb-6">
                      The same AI infrastructure powering KFC's global operations, now available as enterprise APIs
                    </p>
                    <div className="flex items-center justify-center gap-8 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300">First call in &lt;60 seconds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">&lt;50ms response time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300">99.99% uptime SLA</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-8 h-8 text-blue-400" />
                        <h3 className="text-xl font-semibold text-white">AI Intelligence</h3>
                      </div>
                      <p className="text-slate-400 mb-4">
                        Same AI powering KFC's 1M+ daily transactions. Advanced language understanding with business context.
                      </p>
                      <div className="text-sm text-slate-500">
                        • 40+ languages supported<br />
                        • Real-time sentiment analysis<br />
                        • Custom business knowledge
                      </div>
                    </div>

                    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex items-center gap-3 mb-4">
                        <Home className="w-8 h-8 text-green-400" />
                        <h3 className="text-xl font-semibold text-white">Smart Home APIs</h3>
                      </div>
                      <p className="text-slate-400 mb-4">
                        100% local AI processing. Replace Alexa/Siri with privacy-first smart home control.
                      </p>
                      <div className="text-sm text-slate-500">
                        • No cloud surveillance<br />
                        • 10x faster than Alexa<br />
                        • Works completely offline
                      </div>
                    </div>

                    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                        <h3 className="text-xl font-semibold text-white">Business Automation</h3>
                      </div>
                      <p className="text-slate-400 mb-4">
                        Intelligent booking, document analysis, and workflow automation with proven ROI.
                      </p>
                      <div className="text-sm text-slate-500">
                        • 60% efficiency improvement<br />
                        • ROI in 3-6 months<br />
                        • Enterprise-grade reliability
                      </div>
                    </div>
                  </div>

                  {/* Success Stories */}
                  <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Trusted by Industry Leaders</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-900 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">🍗 KFC Global Partnership</h4>
                        <p className="text-slate-400 text-sm mb-2">
                          Processing 1M+ transactions daily across global locations with 99.9% uptime
                        </p>
                        <div className="text-xs text-slate-500">
                          40% faster drive-thru • 30% reduced food waste • €2M+ annual savings
                        </div>
                      </div>
                      <div className="p-4 bg-slate-900 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">🏠 Smart Home Revolution</h4>
                        <p className="text-slate-400 text-sm mb-2">
                          10,000+ homes converted to local AI, replacing Alexa and Google Assistant
                        </p>
                        <div className="text-xs text-slate-500">
                          100% privacy • 50ms response • Works offline • No monthly fees
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'quickstart' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Rocket className="w-8 h-8 text-blue-400" />
                    <div>
                      <h1 className="text-3xl font-bold text-white">Quick Start Guide</h1>
                      <p className="text-slate-400">Get your first API call working in under 60 seconds</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-6">
                    <div className="flex gap-4 p-6 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">Generate Your API Key</h3>
                        <p className="text-slate-400 mb-4">
                          Get instant access with 100 free API calls per month. No credit card required.
                        </p>
                        {!apiKey ? (
                          <button
                            onClick={generateApiKey}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                          >
                            {isGenerating ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Key className="w-4 h-4" />
                                Generate Free API Key
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg">
                            <code className="flex-1 text-green-400 font-mono text-sm">{apiKey}</code>
                            <button
                              onClick={() => copyToClipboard(apiKey)}
                              className="p-1 hover:bg-slate-700 rounded"
                            >
                              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 p-6 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">Choose Your Endpoint</h3>
                        <p className="text-slate-400 mb-4">
                          Select from our powerful APIs and see live code examples.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(endpoints).map(([path, endpoint]) => (
                            <button
                              key={path}
                              onClick={() => setSelectedEndpoint(path)}
                              className={`p-3 text-left rounded-lg border transition-colors ${
                                selectedEndpoint === path
                                  ? 'bg-blue-900 border-blue-600 text-white'
                                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                              }`}
                            >
                              <div className="font-semibold text-sm">{endpoint.name}</div>
                              <div className="text-xs text-slate-500">{endpoint.price} • {endpoint.response_time}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 p-6 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">Test Your First Call</h3>
                        <p className="text-slate-400 mb-4">
                          Try the API directly in your browser to see it in action.
                        </p>
                        <div className="flex gap-2 mb-4">
                          <button
                            onClick={testEndpoint}
                            disabled={isTestingAPI || !apiKey}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                          >
                            {isTestingAPI ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Testing...
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4" />
                                Test API Call
                              </>
                            )}
                          </button>
                        </div>
                        
                        {testResponse && (
                          <div className={`p-4 rounded-lg ${
                            testResponse.type === 'success' ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              {testResponse.type === 'success' ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                              )}
                              <span className={testResponse.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                                {testResponse.message}
                              </span>
                            </div>
                            {testResponse.data && (
                              <pre className="text-sm text-slate-300 bg-slate-900 p-3 rounded overflow-x-auto">
                                {JSON.stringify(testResponse.data, null, 2)}
                              </pre>
                            )}
                            {testResponse.responseTime && (
                              <div className="text-sm text-slate-400 mt-2">
                                Response time: {testResponse.responseTime}ms
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">🚀 Ready to Scale?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">📚 Explore All APIs</h4>
                        <p className="text-slate-400 text-sm">
                          Browse our complete API reference with interactive examples
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">🔧 Set Up Webhooks</h4>
                        <p className="text-slate-400 text-sm">
                          Get real-time notifications with our enterprise webhook system
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">📈 Monitor Usage</h4>
                        <p className="text-slate-400 text-sm">
                          Track your API usage and optimize costs with detailed analytics
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'endpoints' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Code className="w-8 h-8 text-blue-400" />
                    <div>
                      <h1 className="text-3xl font-bold text-white">API Reference</h1>
                      <p className="text-slate-400">Complete documentation for all EA-S APIs</p>
                    </div>
                  </div>

                  {/* Endpoint Documentation */}
                  <div className="space-y-6">
                    {Object.entries(endpoints).map(([path, endpoint]) => (
                      <div key={path} className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${ 
                              endpoint.method === 'POST' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-lg font-mono text-blue-400">{path}</code>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{endpoint.price}</span>
                            <span>{endpoint.response_time}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-white mb-2">{endpoint.name}</h3>
                        <p className="text-slate-400 mb-4">{endpoint.description}</p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-white mb-2">Request Example</h4>
                            <pre className="text-sm text-slate-300 bg-slate-900 p-4 rounded-lg overflow-x-auto">
                              {JSON.stringify(endpoint.example.request, null, 2)}
                            </pre>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-white mb-2">Response Example</h4>
                            <pre className="text-sm text-slate-300 bg-slate-900 p-4 rounded-lg overflow-x-auto">
                              {JSON.stringify(endpoint.example.response, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'keys' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Key className="w-8 h-8 text-blue-400" />
                    <div>
                      <h1 className="text-3xl font-bold text-white">API Keys</h1>
                      <p className="text-slate-400">Manage your API keys and authentication</p>
                    </div>
                  </div>

                  {/* Current API Key */}
                  <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Your API Key</h3>
                    {apiKey ? (
                      <div>
                        <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg mb-4">
                          <code className="flex-1 text-green-400 font-mono text-sm">{apiKey}</code>
                          <button
                            onClick={() => copyToClipboard(apiKey)}
                            className="p-1 hover:bg-slate-700 rounded"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                          </button>
                        </div>
                        <div className="text-sm text-slate-400">
                          Created: {new Date().toLocaleDateString()} • Status: Active • Tier: {usageData?.tier}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-slate-400 mb-4">No API key generated yet</p>
                        <button
                          onClick={generateApiKey}
                          disabled={isGenerating}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors mx-auto"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Key className="w-4 h-4" />
                              Generate API Key
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Security Best Practices */}
                  <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Security Best Practices</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-white">Keep Your Keys Secret</h4>
                          <p className="text-slate-400 text-sm">Never expose API keys in client-side code or public repositories</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-white">Use Environment Variables</h4>
                          <p className="text-slate-400 text-sm">Store keys in environment variables or secure configuration systems</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Activity className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-white">Monitor Usage</h4>
                          <p className="text-slate-400 text-sm">Regularly review API usage logs for any unusual activity</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'usage' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                    <div>
                      <h1 className="text-3xl font-bold text-white">Usage & Billing</h1>
                      <p className="text-slate-400">Monitor your API usage and manage billing</p>
                    </div>
                  </div>

                  {/* Current Usage */}
                  <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Current Usage - {usageData?.tier} Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-1">
                          {usageData?.current.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">API Calls This Month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-1">
                          {usageData?.percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">of Monthly Quota Used</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                          €{usageData?.monthlyFee}
                        </div>
                        <div className="text-sm text-slate-400">Monthly Plan Cost</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Usage Progress</span>
                        <span className="text-white">{usageData?.current.toLocaleString()} / {usageData?.limit.toLocaleString()} calls</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            usageData?.percentage >= 90 ? 'bg-red-500' : 
                            usageData?.percentage >= 70 ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(usageData?.percentage || 0, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Tiers */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">Available Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {tiers.map((tier) => (
                        <div 
                          key={tier.name}
                          className={`p-6 rounded-xl border ${
                            tier.highlight 
                              ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-600' 
                              : 'bg-slate-800 border-slate-700'
                          }`}
                        >
                          <div className="text-center">
                            <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
                            <div className="text-3xl font-bold text-blue-400 mb-1">{tier.price}</div>
                            <div className="text-slate-400 mb-4">per month</div>
                            <div className="text-lg font-semibold text-white mb-4">{tier.calls}</div>
                            
                            <ul className="text-sm text-slate-300 space-y-2 mb-6">
                              {tier.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            
                            <button 
                              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                                tier.highlight
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-slate-700 hover:bg-slate-600 text-white'
                              }`}
                            >
                              {tier.ctaText}
                            </button>
                            
                            {tier.savings && (
                              <div className="text-xs text-green-400 mt-2">
                                {tier.savings}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'webhooks' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Webhook className="w-8 h-8 text-blue-400" />
                    <div>
                      <h1 className="text-3xl font-bold text-white">Webhooks</h1>
                      <p className="text-slate-400">Real-time notifications with enterprise reliability</p>
                    </div>
                  </div>

                  {/* Webhook Features */}
                  <div className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Enterprise-Grade Webhook System</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-green-400" />
                          <span className="font-semibold text-white">99.95% Delivery Rate</span>
                        </div>
                        <p className="text-slate-400 text-sm">25 automatic retries with exponential backoff</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-white">Secure Signatures</span>
                        </div>
                        <p className="text-slate-400 text-sm">HMAC-SHA256 signatures for verification</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-purple-400" />
                          <span className="font-semibold text-white">Real-time Events</span>
                        </div>
                        <p className="text-slate-400 text-sm">Instant notifications for all API events</p>
                      </div>
                    </div>
                  </div>

                  {/* Available Events */}
                  <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Available Events</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { event: 'api.call.completed', description: 'Triggered after each API call' },
                        { event: 'quota.warning', description: 'At 80%, 90%, 95% quota usage' },
                        { event: 'quota.exceeded', description: 'When quota limit is reached' },
                        { event: 'subscription.upgraded', description: 'When plan is upgraded' },
                        { event: 'payment.processed', description: 'After successful payment' },
                        { event: 'error.critical', description: 'For critical system errors' }
                      ].map((item) => (
                        <div key={item.event} className="p-3 bg-slate-900 rounded-lg">
                          <code className="text-blue-400 font-mono text-sm">{item.event}</code>
                          <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Setup Instructions */}
                  <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Setup Instructions</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <h4 className="font-semibold text-white">Register Webhook Endpoint</h4>
                          <p className="text-slate-400 text-sm">Use the API to register your webhook URL</p>
                          <pre className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg mt-2 overflow-x-auto">
{`POST /v2/webhooks
{
  "url": "https://your-app.com/webhooks/ea-s",
  "events": ["api.call.completed", "quota.warning"]
}`}
                          </pre>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <h4 className="font-semibold text-white">Verify Signatures</h4>
                          <p className="text-slate-400 text-sm">Validate webhook authenticity with HMAC signatures</p>
                          <pre className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg mt-2 overflow-x-auto">
{`// Node.js example
const crypto = require('crypto');
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(requestBody)
  .digest('hex');`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortal;
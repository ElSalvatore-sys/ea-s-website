/**
 * Debug Dashboard Page
 * Shows content validation results and helps identify issues
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Download,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Bug,
  FileWarning,
  Image,
  Type
} from 'lucide-react';
import { 
  generateValidationReport, 
  exportValidationReport,
  scanForTranslationKeys,
  scanForPlaceholders,
  scanForEmptyContent,
  scanForBrokenAssets
} from '../utils/contentValidation';

interface ValidationIssue {
  type: 'translation_key' | 'placeholder' | 'empty_content' | 'broken_asset';
  severity: 'critical' | 'warning' | 'info';
  location: string;
  message: string;
  details?: any;
}

interface ValidationReport {
  timestamp: string;
  environment: string;
  issues: ValidationIssue[];
  summary: {
    total: number;
    critical: number;
    warnings: number;
    info: number;
  };
}

const Debug: React.FC = () => {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<{ [key: number]: boolean }>({});
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Only allow access in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      window.location.href = '/';
    }
  }, []);

  // Run validation
  const runValidation = async () => {
    setLoading(true);
    try {
      const validationReport = await generateValidationReport();
      setReport(validationReport);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(runValidation, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Initial validation
  useEffect(() => {
    runValidation();
  }, []);

  // Filter issues
  const filteredIssues = report?.issues.filter(issue => {
    if (filter === 'all') return true;
    if (filter === 'critical') return issue.severity === 'critical';
    if (filter === 'warning') return issue.severity === 'warning';
    if (filter === 'info') return issue.severity === 'info';
    return issue.type === filter;
  }) || [];

  // Get icon for issue type
  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'translation_key':
        return <Type className="w-5 h-5" />;
      case 'placeholder':
        return <FileWarning className="w-5 h-5" />;
      case 'empty_content':
        return <AlertCircle className="w-5 h-5" />;
      case 'broken_asset':
        return <Image className="w-5 h-5" />;
      default:
        return <Bug className="w-5 h-5" />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bug className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Content Validation Debug</h1>
                <p className="text-sm text-gray-400">
                  Environment: <span className="text-purple-400">{process.env.NODE_ENV}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Auto-refresh toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  autoRefresh 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-white/10 text-gray-400 border border-white/10 hover:bg-white/20'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span>Auto-refresh</span>
              </button>

              {/* Manual refresh */}
              <button
                onClick={runValidation}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Run Validation</span>
              </button>

              {/* Export report */}
              {report && (
                <button
                  onClick={() => exportValidationReport(report)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {report && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Total Issues</span>
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-white">{report.summary.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-red-500/10 backdrop-blur-xl rounded-xl border border-red-500/20 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-400">Critical</span>
                <X className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-3xl font-bold text-red-400">{report.summary.critical}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-500/10 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400">Warnings</span>
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-yellow-400">{report.summary.warnings}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-500/10 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400">Info</span>
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400">{report.summary.info}</p>
            </motion.div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['all', 'critical', 'warning', 'info', 'translation_key', 'placeholder', 'empty_content', 'broken_asset'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === f
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                {f !== 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({report.issues.filter(i => f.includes('_') ? i.type === f : i.severity === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            {filteredIssues.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-500/10 backdrop-blur-xl rounded-xl border border-green-500/20 p-8 text-center"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-400">No Issues Found!</h3>
                <p className="text-gray-400 mt-2">
                  {filter === 'all' 
                    ? 'Your content validation passed with no issues.'
                    : `No ${filter.replace('_', ' ')} issues found.`}
                </p>
              </motion.div>
            ) : (
              filteredIssues.map((issue, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`rounded-xl border p-4 ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold">
                            {issue.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            issue.severity === 'critical' ? 'bg-red-600 text-white' :
                            issue.severity === 'warning' ? 'bg-yellow-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-white">{issue.message}</p>
                        <p className="text-xs opacity-70 mt-1">Location: {issue.location}</p>
                        
                        {issue.details && (
                          <button
                            onClick={() => setShowDetails({ ...showDetails, [index]: !showDetails[index] })}
                            className="flex items-center space-x-1 text-xs mt-2 opacity-70 hover:opacity-100 transition-opacity"
                          >
                            {showDetails[index] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showDetails[index] ? 'Hide' : 'Show'} details</span>
                          </button>
                        )}
                        
                        {showDetails[index] && issue.details && (
                          <pre className="mt-2 p-2 bg-black/30 rounded text-xs overflow-x-auto">
                            {JSON.stringify(issue.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Last Updated */}
          {report && (
            <div className="mt-8 text-center text-sm text-gray-500">
              Last validated: {new Date(report.timestamp).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && !report && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Running content validation...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Debug;
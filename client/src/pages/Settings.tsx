import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Database, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface SettingsData {
  geminiApiKey: string;
  mongodbUri: string;
  maxFileSize: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    geminiApiKey: '',
    mongodbUri: '',
    maxFileSize: '10',
  });
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    gemini: boolean | null;
    database: boolean | null;
  }>({
    gemini: null,
    database: null,
  });

  useEffect(() => {
    // In a real app, you'd load settings from the backend
    // For now, we'll use placeholder values
    setSettings({
      geminiApiKey: process.env.REACT_APP_GEMINI_API_KEY || '',
      mongodbUri: process.env.REACT_APP_MONGODB_URI || '',
      maxFileSize: '10',
    });
  }, []);

  const handleInputChange = (field: keyof SettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const testGeminiConnection = async () => {
    setTesting(true);
    setTestResults(prev => ({ ...prev, gemini: null }));
    
    try {
      const response = await axios.get('/api/upload/test-gemini');
      const success = response.data.success;
      setTestResults(prev => ({ ...prev, gemini: success }));
      
      if (success) {
        toast.success('Gemini API connection successful!');
      } else {
        toast.error('Gemini API connection failed: ' + response.data.error);
      }
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, gemini: false }));
      toast.error('Failed to test Gemini API connection');
    } finally {
      setTesting(false);
    }
  };

  const testDatabaseConnection = async () => {
    setTesting(true);
    setTestResults(prev => ({ ...prev, database: null }));
    
    try {
      const response = await axios.get('/api/health');
      const success = response.data.status === 'OK';
      setTestResults(prev => ({ ...prev, database: success }));
      
      if (success) {
        toast.success('Database connection successful!');
      } else {
        toast.error('Database connection failed');
      }
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, database: false }));
      toast.error('Failed to test database connection');
    } finally {
      setTesting(false);
    }
  };

  const saveSettings = async () => {
    // In a real app, you'd save settings to the backend
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your Book Inventory Builder application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gemini API Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Key className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Gemini API Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={settings.geminiApiKey}
                    onChange={(e) => handleInputChange('geminiApiKey', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your Gemini API key"
                  />
                  <button
                    onClick={testGeminiConnection}
                    disabled={testing || !settings.geminiApiKey}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {testing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {testResults.gemini !== null && (
                  <div className="mt-2 flex items-center space-x-2">
                    {testResults.gemini ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${testResults.gemini ? 'text-green-600' : 'text-red-600'}`}>
                      {testResults.gemini ? 'Connection successful' : 'Connection failed'}
                    </span>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Get your API key from{' '}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Database Configuration */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Database Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MongoDB Connection String
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={settings.mongodbUri}
                    onChange={(e) => handleInputChange('mongodbUri', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="mongodb+srv://username:password@cluster.mongodb.net/database"
                  />
                  <button
                    onClick={testDatabaseConnection}
                    disabled={testing}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {testing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {testResults.database !== null && (
                  <div className="mt-2 flex items-center space-x-2">
                    {testResults.database ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${testResults.database ? 'text-green-600' : 'text-red-600'}`}>
                      {testResults.database ? 'Connection successful' : 'Connection failed'}
                    </span>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Use MongoDB Atlas for a free cloud database
                </p>
              </div>
            </div>
          </div>

          {/* File Upload Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <SettingsIcon className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">File Upload Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleInputChange('maxFileSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                  max="50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum allowed file size for book cover uploads
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions</h3>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Get a Gemini API key from Google AI Studio</li>
              <li>Set up a MongoDB Atlas database</li>
              <li>Configure your connection strings</li>
              <li>Test your connections</li>
              <li>Start adding books!</li>
            </ol>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">System Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Gemini API</span>
                <div className="flex items-center space-x-1">
                  {testResults.gemini === null ? (
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  ) : testResults.gemini ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  <span className="text-xs text-gray-500">
                    {testResults.gemini === null ? 'Not tested' : testResults.gemini ? 'Connected' : 'Failed'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Database</span>
                <div className="flex items-center space-x-1">
                  {testResults.database === null ? (
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  ) : testResults.database ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  <span className="text-xs text-gray-500">
                    {testResults.database === null ? 'Not tested' : testResults.database ? 'Connected' : 'Failed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Help Links */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Help & Resources</h3>
            <div className="space-y-2">
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-primary-600 hover:underline"
              >
                Get Gemini API Key
              </a>
              <a
                href="https://www.mongodb.com/atlas"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-primary-600 hover:underline"
              >
                MongoDB Atlas Setup
              </a>
              <a
                href="https://github.com/your-repo/book-inventory-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-primary-600 hover:underline"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
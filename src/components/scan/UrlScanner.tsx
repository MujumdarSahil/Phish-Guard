import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useModel, ModelType, ScanResult } from '../../contexts/ModelContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface UrlScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

export default function UrlScanner({ onScanComplete }: UrlScannerProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const { scanUrl, activeModel, loadingModel } = useModel();
  const { user } = useAuth();

  const validateUrl = (url: string): boolean => {
    if (!url) {
      setError('Please enter a URL to scan');
      return false;
    }

    try {
      // Add http if missing
      const urlWithProtocol = url.startsWith('http') ? url : `http://${url}`;
      new URL(urlWithProtocol);
      return true;
    } catch (e) {
      setError('Please enter a valid URL');
      return false;
    }
  };

  const handleScan = async () => {
    setError('');
    
    if (!validateUrl(url)) {
      return;
    }

    try {
      setScanning(true);
      const urlToScan = url.startsWith('http') ? url : `http://${url}`;
      
      const scanResult = await scanUrl(urlToScan, activeModel);
      setResult(scanResult);
      
      // Save scan to history
      if (user) {
        const { error } = await supabase
          .from('scan_history')
          .insert({
            user_id: user.id,
            url: scanResult.url,
            is_phishing: scanResult.isPhishing,
            confidence_score: scanResult.confidenceScore,
            model_used: scanResult.modelUsed,
            features: scanResult.features
          });
          
        if (error) {
          console.error('Error saving scan history:', error);
        }
      }
      
      // Call callback if provided
      if (onScanComplete) {
        onScanComplete(scanResult);
      }
    } catch (err) {
      toast.error('Error scanning URL. Please try again.');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const getResultColor = () => {
    if (!result) return '';
    return result.isPhishing ? 'text-danger-600' : 'text-success-600';
  };

  const getResultBackground = () => {
    if (!result) return '';
    return result.isPhishing ? 'bg-danger-50' : 'bg-success-50';
  };

  const getResultIcon = () => {
    if (!result) return null;
    return result.isPhishing ? (
      <AlertCircle className="w-6 h-6 text-danger-600" />
    ) : (
      <CheckCircle className="w-6 h-6 text-success-600" />
    );
  };

  const getResultMessage = () => {
    if (!result) return '';
    
    const confidencePercent = Math.round(result.confidenceScore * 100);
    
    return result.isPhishing
      ? `This URL is likely a phishing website (${confidencePercent}% confidence)`
      : `This URL appears to be safe (${confidencePercent}% confidence)`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Scan URL for Phishing</h2>
        
        <div className="mb-6">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Enter URL to scan
          </label>
          <div className="relative">
            <input
              type="text"
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              className="input pl-10 pr-4 py-3"
              disabled={scanning || loadingModel}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleScan}
            disabled={scanning || loadingModel || !url}
            className={`btn btn-primary flex items-center space-x-2 ${
              (scanning || loadingModel) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>{scanning || loadingModel ? 'Scanning...' : 'Scan URL'}</span>
          </button>
          
          <div className="text-sm text-gray-500">
            Using: <span className="font-medium">{activeModel === 'model1' ? 'Primary Model' : 'Secondary Model'}</span>
          </div>
        </div>
        
        {(scanning || loadingModel) && (
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
              <span className="text-gray-700">Analyzing URL for phishing indicators...</span>
            </div>
          </div>
        )}
        
        {result && !scanning && !loadingModel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-6 p-4 rounded-lg ${getResultBackground()}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {getResultIcon()}
              </div>
              <div className="ml-3">
                <h3 className={`text-lg font-medium ${getResultColor()}`}>
                  {getResultMessage()}
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Scanned URL: <span className="font-medium">{result.url}</span></p>
                  
                  {result.features && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(result.features).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="ml-2 font-medium">
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
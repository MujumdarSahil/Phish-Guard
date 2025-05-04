import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import UrlScanner from '../components/scan/UrlScanner';
import { ScanResult, ModelType, useModel } from '../contexts/ModelContext';

export default function ScanUrl() {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const { activeModel, setActiveModel } = useModel();

  const handleScanComplete = (result: ScanResult) => {
    setScanResults(prev => [result, ...prev]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Scan URL</h1>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <label htmlFor="model-select" className="text-sm font-medium text-gray-700">
            Model:
          </label>
          <select
            id="model-select"
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value as ModelType)}
            className="input py-1 pl-3 pr-8 max-w-[200px]"
          >
            <option value="model1">Primary Model</option>
            <option value="model2">Secondary Model</option>
          </select>
        </div>
      </div>
      
      <UrlScanner onScanComplete={handleScanComplete} />
      
      {scanResults.length > 0 && (
        <section>
          <h2 className="section-title">Scan Results</h2>
          
          <div className="space-y-4">
            {scanResults.map((result, index) => (
              <motion.div
                key={`${result.url}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`card border-l-4 ${
                  result.isPhishing 
                    ? 'border-l-danger-500 bg-danger-50' 
                    : 'border-l-success-500 bg-success-50'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {result.isPhishing ? (
                      <AlertTriangle className="w-6 h-6 text-danger-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-success-600" />
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-medium ${
                        result.isPhishing ? 'text-danger-800' : 'text-success-800'
                      }`}>
                        {result.isPhishing 
                          ? 'Phishing Site Detected' 
                          : 'Safe Website'
                        }
                      </h3>
                      <span className="text-sm font-medium">
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm">
                      <span className="font-medium">URL:</span> {result.url}
                    </p>
                    
                    <p className="mt-1 text-sm">
                      <span className="font-medium">Confidence:</span> {Math.round(result.confidenceScore * 100)}%
                    </p>
                    
                    <p className="mt-1 text-sm">
                      <span className="font-medium">Model:</span> {result.modelUsed === 'model1' ? 'Primary Model' : 'Secondary Model'}
                    </p>
                    
                    {result.features && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Detected Features:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(result.features).map(([key, value]) => (
                            <div key={key} className="flex items-center text-sm">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                              <span className="ml-2 font-medium">
                                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {result.isPhishing && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-danger-200">
                        <div className="flex items-center">
                          <Shield className="w-5 h-5 text-danger-600 mr-2" />
                          <h4 className="text-sm font-medium text-danger-800">Warning</h4>
                        </div>
                        <p className="mt-1 text-sm text-danger-700">
                          This URL has been identified as a potential phishing site. Do not enter any personal information or credentials.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
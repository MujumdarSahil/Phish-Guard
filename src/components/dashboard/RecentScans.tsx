import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { ScanResult } from '../../contexts/ModelContext';
import { cn } from '../../lib/utils';

interface RecentScansProps {
  scans: ScanResult[];
  isLoading?: boolean;
}

export default function RecentScans({ scans, isLoading = false }: RecentScansProps) {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="mt-2 h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Scans</h3>
        {scans.length > 0 && (
          <a href="/history" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </a>
        )}
      </div>

      {scans.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-gray-500">No scan history yet. Try scanning a URL.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scans.map((scan, index) => (
            <motion.div
              key={scan.timestamp}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={cn(
                "flex-shrink-0 p-2 rounded-full",
                scan.isPhishing ? "bg-danger-100" : "bg-success-100"
              )}>
                {scan.isPhishing ? (
                  <AlertCircle className="w-5 h-5 text-danger-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-success-600" />
                )}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {scan.url}
                  </p>
                  <div className="ml-2 flex-shrink-0">
                    <a 
                      href={scan.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <p className={cn(
                    "text-xs font-medium",
                    scan.isPhishing ? "text-danger-600" : "text-success-600"
                  )}>
                    {scan.isPhishing ? "Phishing" : "Safe"} 
                    <span className="ml-1 text-gray-500">
                      ({Math.round(scan.confidenceScore * 100)}% confidence)
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 ml-4">
                    {new Date(scan.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Search, X, Download, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { ScanResult } from '../contexts/ModelContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, extractDomain } from '../lib/utils';
import { cn } from '../lib/utils';

export default function ScanHistory() {
  const { user } = useAuth();
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhishing, setFilterPhishing] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchScans() {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('scan_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform the data
        const formattedScans: ScanResult[] = data?.map(scan => ({
          url: scan.url,
          isPhishing: scan.is_phishing,
          confidenceScore: scan.confidence_score,
          modelUsed: scan.model_used as 'model1' | 'model2',
          features: scan.features as Record<string, number | string | boolean>,
          timestamp: scan.created_at
        })) || [];
        
        setScans(formattedScans);
      } catch (error) {
        console.error('Error fetching scan history:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchScans();
  }, [user]);

  // For demo purposes, populate with mock data if empty
  useEffect(() => {
    if (!loading && scans.length === 0) {
      const mockScans = Array(15).fill(null).map((_, i) => ({
        url: i % 3 === 0 
          ? `https://suspicious-bank-login${i}.com` 
          : `https://example${i}.com`,
        isPhishing: i % 3 === 0,
        confidenceScore: i % 3 === 0 ? 0.85 + (Math.random() * 0.1) : 0.1 + (Math.random() * 0.1),
        modelUsed: i % 2 === 0 ? 'model1' : 'model2' as 'model1' | 'model2',
        features: {
          hasHttps: Math.random() > 0.5,
          domainAge: Math.floor(Math.random() * 1000),
          redirectCount: Math.floor(Math.random() * 3)
        },
        timestamp: new Date(Date.now() - i * 86400000).toISOString()
      }));
      
      setScans(mockScans);
    }
  }, [loading, scans.length]);

  const filteredScans = scans.filter(scan => {
    const matchesSearch = searchTerm ? scan.url.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesFilter = filterPhishing === null ? true : scan.isPhishing === filterPhishing;
    return matchesSearch && matchesFilter;
  });

  const paginatedScans = filteredScans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredScans.length / itemsPerPage);

  const downloadCSV = () => {
    const headers = [
      'URL',
      'Status',
      'Confidence',
      'Model',
      'Scan Date'
    ];
    
    const csvData = filteredScans.map(scan => [
      scan.url,
      scan.isPhishing ? 'Phishing' : 'Safe',
      `${Math.round(scan.confidenceScore * 100)}%`,
      scan.modelUsed === 'model1' ? 'Primary Model' : 'Secondary Model',
      new Date(scan.timestamp).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `phishing-scan-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Scan History</h1>
        
        <button 
          onClick={downloadCSV}
          className="btn btn-secondary inline-flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>
      
      <div className="card mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search URLs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="input pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <div className="sm:w-44">
            <select
              value={filterPhishing === null ? 'all' : filterPhishing ? 'phishing' : 'safe'}
              onChange={(e) => {
                const value = e.target.value;
                setFilterPhishing(
                  value === 'all' ? null : value === 'phishing'
                );
                setCurrentPage(1);
              }}
              className="input"
            >
              <option value="all">All Results</option>
              <option value="phishing">Phishing Only</option>
              <option value="safe">Safe Only</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="card animate-pulse">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center p-4 border-b">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {paginatedScans.length === 0 ? (
            <div className="card py-12 text-center">
              <p className="text-gray-500">No scan history found with the current filters.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scan Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedScans.map((scan, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {scan.isPhishing ? (
                              <AlertCircle className="w-5 h-5 text-danger-500 mr-2 flex-shrink-0" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-success-500 mr-2 flex-shrink-0" />
                            )}
                            <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {extractDomain(scan.url)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            scan.isPhishing 
                              ? "bg-danger-100 text-danger-800" 
                              : "bg-success-100 text-success-800"
                          )}>
                            {scan.isPhishing ? 'Phishing' : 'Safe'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.round(scan.confidenceScore * 100)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {scan.modelUsed === 'model1' ? 'Primary' : 'Secondary'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(scan.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a 
                            href={scan.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                          >
                            Visit <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredScans.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredScans.length}</span> results
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`btn ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'btn-secondary'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`btn ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'btn-secondary'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
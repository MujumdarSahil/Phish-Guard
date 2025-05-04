import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Shield, 
  AlertCircle, 
  Activity, 
  BarChart2 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import StatCard from '../components/dashboard/StatCard';
import UrlScanner from '../components/scan/UrlScanner';
import RecentScans from '../components/dashboard/RecentScans';
import ModelPerformanceChart from '../components/charts/ModelPerformanceChart';
import { ScanResult, useModel } from '../contexts/ModelContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { activeModel, setActiveModel } = useModel();
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    phishingDetected: 0,
    safeSites: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  // Performance comparison data (would come from your model metrics in a real app)
  const modelPerformanceData = [
    { metric: 'Accuracy', model1: 96, model2: 94 },
    { metric: 'Precision', model1: 98, model2: 92 },
    { metric: 'Recall', model1: 95, model2: 93 },
    { metric: 'F1 Score', model1: 96.5, model2: 92.5 },
  ];

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        if (!user) return;
        
        // Fetch recent scans
        const { data: scanData, error: scanError } = await supabase
          .from('scan_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (scanError) throw scanError;
        
        // Transform the scan data
        const formattedScans: ScanResult[] = scanData?.map(scan => ({
          url: scan.url,
          isPhishing: scan.is_phishing,
          confidenceScore: scan.confidence_score,
          modelUsed: scan.model_used as 'model1' | 'model2',
          features: scan.features as Record<string, number | string | boolean>,
          timestamp: scan.created_at
        })) || [];
        
        setRecentScans(formattedScans);
        
        // Calculate stats
        const { data: statsData, error: statsError } = await supabase
          .from('scan_history')
          .select('is_phishing, count')
          .eq('user_id', user.id)
          .group('is_phishing');
          
        if (statsError) throw statsError;
        
        const totalScans = statsData.reduce((sum, item) => sum + item.count, 0);
        const phishingDetected = statsData.find(item => item.is_phishing)?.count || 0;
        const safeSites = statsData.find(item => !item.is_phishing)?.count || 0;
        
        setStats({
          totalScans,
          phishingDetected,
          safeSites,
          totalUsers: 1 // For demo purposes
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [user]);

  const handleScanComplete = (result: ScanResult) => {
    // Add the new scan to recent scans
    setRecentScans(prev => [result, ...prev.slice(0, 4)]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      phishingDetected: prev.phishingDetected + (result.isPhishing ? 1 : 0),
      safeSites: prev.safeSites + (result.isPhishing ? 0 : 1)
    }));
  };

  // For demo, use mock data when real data isn't available
  useEffect(() => {
    if (loading && recentScans.length === 0) {
      const mockScans: ScanResult[] = [
        {
          url: 'https://example.com',
          isPhishing: false,
          confidenceScore: 0.98,
          modelUsed: 'model1',
          timestamp: new Date().toISOString()
        },
        {
          url: 'https://suspicious-login.com',
          isPhishing: true,
          confidenceScore: 0.89,
          modelUsed: 'model1',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      
      setRecentScans(mockScans);
      
      setStats({
        totalScans: 10,
        phishingDetected: 3,
        safeSites: 7,
        totalUsers: 1
      });
      
      setLoading(false);
    }
  }, [loading, recentScans.length]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Active Model:</span>
          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value as 'model1' | 'model2')}
            className="input py-1 pl-3 pr-8"
          >
            <option value="model1">Primary Model</option>
            <option value="model2">Secondary Model</option>
          </select>
        </div>
      </div>
      
      {/* Quick scan section */}
      <section>
        <UrlScanner onScanComplete={handleScanComplete} />
      </section>
      
      {/* Stats section */}
      <section>
        <h2 className="section-title">Analysis Summary</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Scans"
            value={stats.totalScans}
            icon={Search}
            color="primary"
          />
          <StatCard
            title="Phishing Detected"
            value={stats.phishingDetected}
            icon={AlertCircle}
            color="danger"
          />
          <StatCard
            title="Safe Sites"
            value={stats.safeSites}
            icon={Shield}
            color="success"
          />
          <StatCard
            title="Detection Rate"
            value={`${stats.totalScans ? Math.round((stats.phishingDetected / stats.totalScans) * 100) : 0}%`}
            icon={Activity}
            color="secondary"
          />
        </div>
      </section>
      
      {/* Recent scans and model performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentScans scans={recentScans} isLoading={loading} />
        <ModelPerformanceChart data={modelPerformanceData} />
      </div>
    </div>
  );
}
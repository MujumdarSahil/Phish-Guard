import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceData {
  metric: string;
  model1: number;
  model2: number;
}

interface ModelPerformanceChartProps {
  data: PerformanceData[];
}

export default function ModelPerformanceChart({ data }: ModelPerformanceChartProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Model Performance Comparison</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value}%`, '']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
            }}
          />
          <Legend />
          <Bar dataKey="model1" name="Primary Model" fill="#4338CA" radius={[4, 4, 0, 0]} />
          <Bar dataKey="model2" name="Secondary Model" fill="#7C3AED" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
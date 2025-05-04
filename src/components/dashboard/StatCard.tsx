import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary'
}: StatCardProps) {
  const getIconColor = () => {
    switch (color) {
      case 'primary': return 'text-primary-600 bg-primary-100';
      case 'secondary': return 'text-secondary-600 bg-secondary-100';
      case 'success': return 'text-success-600 bg-success-100';
      case 'warning': return 'text-warning-600 bg-warning-100';
      case 'danger': return 'text-danger-600 bg-danger-100';
      default: return 'text-primary-600 bg-primary-100';
    }
  };
  
  const getTrendColor = () => {
    if (!trend) return '';
    return trend === 'up' 
      ? 'text-success-600' 
      : trend === 'down' 
        ? 'text-danger-600' 
        : 'text-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", getIconColor())}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && trendValue && (
        <div className="mt-4 flex items-center">
          <span className={cn("text-sm font-medium", getTrendColor())}>
            {trendValue}
          </span>
          <span className="text-sm text-gray-500 ml-1">
            {trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : 'no change'} from last period
          </span>
        </div>
      )}
    </motion.div>
  );
}
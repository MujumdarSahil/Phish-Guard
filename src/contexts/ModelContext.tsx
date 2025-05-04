import React, { createContext, useContext, useState } from 'react';

// Model type definitions
export type ModelType = 'model1' | 'model2';
export type ModelFeatures = Record<string, number | string | boolean>;

export interface ScanResult {
  url: string;
  isPhishing: boolean;
  confidenceScore: number;
  modelUsed: ModelType;
  features?: ModelFeatures;
  timestamp: string;
}

interface ModelContextType {
  scanUrl: (url: string, modelType: ModelType) => Promise<ScanResult>;
  loadingModel: boolean;
  activeModel: ModelType;
  setActiveModel: (model: ModelType) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [loadingModel, setLoadingModel] = useState(false);
  const [activeModel, setActiveModel] = useState<ModelType>('model1');

  // This function would normally call your API that interfaces with the ML model
  const scanUrl = async (url: string, modelType: ModelType): Promise<ScanResult> => {
    setLoadingModel(true);
    
    try {
      // In a real application, this would be an API call to your ML model endpoint
      // For this example, we'll simulate the model behavior
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Simulate different behaviors for different models (for demonstration)
      let isPhishing: boolean;
      let confidenceScore: number;
      let features: ModelFeatures = {};
      
      // Simple heuristic for demo purposes
      if (url.includes('secure') || url.includes('bank') || url.includes('login')) {
        isPhishing = modelType === 'model1' ? true : Math.random() > 0.3;
        confidenceScore = modelType === 'model1' ? 0.89 : 0.76;
        
        features = {
          hasHttps: url.startsWith('https'),
          domainAge: 30,
          hasSuspiciousWords: true,
          redirectCount: 2,
          formCount: 1
        };
      } else {
        isPhishing = Math.random() > 0.8;
        confidenceScore = isPhishing ? 0.6 + Math.random() * 0.3 : 0.1 + Math.random() * 0.2;
        
        features = {
          hasHttps: url.startsWith('https'),
          domainAge: Math.floor(Math.random() * 1000),
          hasSuspiciousWords: Math.random() > 0.7,
          redirectCount: Math.floor(Math.random() * 3),
          formCount: Math.floor(Math.random() * 2)
        };
      }
      
      return {
        url,
        isPhishing,
        confidenceScore,
        modelUsed: modelType,
        features,
        timestamp: new Date().toISOString()
      };
    } finally {
      setLoadingModel(false);
    }
  };

  return (
    <ModelContext.Provider value={{
      scanUrl,
      loadingModel,
      activeModel,
      setActiveModel
    }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  lastModified: Date;
  content?: string;
}

export interface AnalysisResult {
  originalName: string;
  suggestedName: string;
  type: string;
  size: number;
  projectContext?: {
    relatedProject: string;
    suggestedTasks: string[];
    priority?: 'high' | 'medium' | 'low';
  };
  contentSummary?: string;
  tags: string[];
}
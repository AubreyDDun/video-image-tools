'use client';

interface ProcessingStatusProps {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress?: number;
  message?: string;
  error?: string;
}

export default function ProcessingStatus({ 
  status, 
  progress,
  message,
  error 
}: ProcessingStatusProps) {
  if (status === 'idle') {
    return null;
  }

  if (status === 'processing') {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{message || '处理中...'}</span>
          {progress !== undefined && (
            <span className="text-gray-500">{progress}%</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <span>✅</span>
        <span className="text-sm">{message || '处理完成'}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <span>❌</span>
        <span className="text-sm">{error || '处理失败'}</span>
      </div>
    );
  }

  return null;
}

'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import ProcessingStatus from '@/components/ProcessingStatus';
import DownloadButton from '@/components/DownloadButton';
import { convertVideo } from '@/lib/ffmpeg/videoConvert';

type OutputFormat = 'mp4' | 'webm' | 'avi' | 'mov' | 'gif';

const formatOptions: { value: OutputFormat; label: string; desc: string; icon: string }[] = [
  { value: 'mp4', label: 'MP4', desc: '最通用，兼容性好', icon: '' },
  { value: 'webm', label: 'WebM', desc: '网页优化，体积小', icon: '🌐' },
  { value: 'mov', label: 'MOV', desc: 'Apple 设备', icon: '🍎' },
  { value: 'avi', label: 'AVI', desc: '传统格式', icon: '📼' },
  { value: 'gif', label: 'GIF', desc: '动图格式', icon: '🎬' },
];

export default function VideoConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<OutputFormat>('mp4');
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setStatus('processing');
    setProgress(10);
    setError('');

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 500);

      setProgress(30);
      const result = await convertVideo(file, targetFormat);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(result);
      setStatus('complete');
    } catch (err) {
      console.error('转换失败:', err);
      setError(err instanceof Error ? err.message : '转换失败，请检查视频格式');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getVideoFormat = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext?.toUpperCase() || '未知';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">视频格式转换</h1>
        <p className="text-gray-600 dark:text-gray-300">
          在线转换视频格式，支持 MP4、WebM、MOV、AVI、GIF
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">本地处理</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">文件不上传服务器</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">快速转换</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">多线程处理</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">高质量</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">保持原始画质</div>
        </div>
      </div>

      {/* Uploader */}
      <FileUploader
        accept="video/*"
        onFileSelect={setFile}
        label="选择视频文件（MP4、MOV、HEVC、AVI、WebM 等）"
      />

      {/* Format Selection */}
      {file && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">选择目标格式</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {formatOptions.map((format) => (
              <button
                key={format.value}
                onClick={() => setTargetFormat(format.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  targetFormat === format.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{format.icon}</div>
                <div className="font-medium text-gray-900 dark:text-white">{format.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{format.desc}</div>
              </button>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">原始格式：</span>
                <span className="font-medium text-gray-900 dark:text-white">{getVideoFormat(file.name)}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">文件大小：</span>
                <span className="font-medium text-gray-900 dark:text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {file && !result && (
        <button
          onClick={handleConvert}
          disabled={loading || status === 'processing'}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '处理中...' : `转换为 ${targetFormat.toUpperCase()}`}
        </button>
      )}

      {/* Status */}
      <ProcessingStatus
        status={status}
        progress={progress}
        message={status === 'complete' ? '转换完成！' : undefined}
        error={error}
      />

      {/* Download */}
      {result && file && (
        <div className="space-y-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">原始格式：</span>
              <span className="font-medium text-gray-900 dark:text-white">{getVideoFormat(file.name)}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">转换后：</span>
              <span className="font-medium text-green-600 dark:text-green-400">{targetFormat.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            输出大小：{(result.size / 1024 / 1024).toFixed(2)} MB
          </div>
          <DownloadButton
            blob={result.blob}
            filename={`converted_${file.name.split('.')[0]}.${targetFormat}`}
            label="下载转换后的视频"
            className="w-full justify-center"
          />
          <button
            onClick={() => {
              setFile(null);
              setResult(null);
              setStatus('idle');
              setError('');
              setProgress(0);
            }}
            className="w-full py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            转换另一个文件
          </button>
        </div>
      )}
    </div>
  );
}

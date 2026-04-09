'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import ProcessingStatus from '@/components/ProcessingStatus';
import DownloadButton from '@/components/DownloadButton';
import { compressVideo } from '@/lib/ffmpeg/videoCompress';

export default function VideoCompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setDebugLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleCompress = async () => {
    if (!file) return;

    setLoading(true);
    setStatus('processing');
    setProgress(0);
    setError('');
    setDebugLog([]);
    addLog(`开始压缩：${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    try {
      const result = await compressVideo(file, quality / 100, (p) => {
        setProgress(p);
        addLog(`进度：${p}%`);
      });
      
      setResult(result);
      setStatus('complete');
      addLog(`压缩完成：${(result.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (err) {
      console.error('压缩失败:', err);
      const errMsg = err instanceof Error ? err.message : '压缩失败';
      setError(errMsg);
      setStatus('error');
      addLog(`错误：${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const compressionRatio = file && result 
    ? ((1 - result.size / file.size) * 100).toFixed(1) 
    : null;

  // 检测视频格式
  const getVideoFormat = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const formats: Record<string, string> = {
      'mp4': 'MP4 (H.264/AAC)',
      'mov': 'MOV (iPhone/QuickTime)',
      'avi': 'AVI',
      'webm': 'WebM (VP8/VP9)',
      'mkv': 'MKV',
      'm4v': 'M4V (iTunes)',
      'hevc': 'HEVC/H.265',
      'h265': 'HEVC/H.265',
      '3gp': '3GP',
      'wmv': 'WMV',
      'flv': 'FLV',
    };
    return formats[ext || ''] || ext?.toUpperCase() || '未知格式';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">视频压缩</h1>
        <p className="text-gray-600 dark:text-gray-300">
          在线压缩视频文件，支持 MP4、MOV、HEVC、AVI、WebM 等格式
        </p>
      </div>

      {/* Supported Formats */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">📁 支持的输入格式：</h3>
        <div className="flex flex-wrap gap-2">
          {['MP4', 'MOV', 'AVI', 'WebM', 'MKV', 'M4V', 'HEVC/H.265', '3GP', 'WMV', 'FLV'].map((fmt) => (
            <span key={fmt} className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-700">
              {fmt}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          💡 输出格式：MP4 (H.264 + AAC)，兼容所有设备和平台
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
          <div className="text-sm font-medium text-gray-900 dark:text-white">H.264/HEVC</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">支持 iPhone 格式</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">可调质量</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">自由控制压缩比</div>
        </div>
      </div>

      {/* Uploader */}
      <FileUploader
        accept="video/*"
        onFileSelect={setFile}
        label="选择视频文件（MP4、MOV、HEVC、AVI、WebM 等）"
      />

      {/* Quality Slider */}
      {file && (
        <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-700 dark:text-gray-300">压缩质量</label>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{quality}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>高压缩 (30%)</span>
            <span>低压缩 (100%)</span>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">文件格式：</span>
                <span className="font-medium text-gray-900 dark:text-white">{getVideoFormat(file.name)}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">原始大小：</span>
                <span className="font-medium text-gray-900 dark:text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {file && !result && (
        <button
          onClick={handleCompress}
          disabled={loading || status === 'processing'}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '处理中...' : '开始压缩'}
        </button>
      )}

      {/* Status */}
      <ProcessingStatus
        status={status}
        progress={progress}
        message={status === 'complete' ? `压缩完成！压缩率：${compressionRatio}%` : undefined}
        error={error}
      />

      {/* Debug Log */}
      {debugLog.length > 0 && (
        <details className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg" open>
          <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
            📝 调试日志
          </summary>
          <div className="mt-2 space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400 max-h-96 overflow-y-auto">
            {debugLog.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </details>
      )}

      {/* Download */}
      {result && file && (
        <div className="space-y-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">原始大小：</span>
              <span className="font-medium text-gray-900 dark:text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">压缩后：</span>
              <span className="font-medium text-green-600 dark:text-green-400">{(result.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          {compressionRatio && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              节省了 <span className="font-bold text-green-600 dark:text-green-400">{compressionRatio}%</span> 的空间
            </div>
          )}
          <DownloadButton
            blob={result.blob}
            filename={`compressed_${file.name}`}
            label="下载压缩后的视频"
            className="w-full justify-center"
          />
          <button
            onClick={() => {
              setFile(null);
              setResult(null);
              setStatus('idle');
              setError('');
              setProgress(0);
              setDebugLog([]);
            }}
            className="w-full py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            压缩另一个文件
          </button>
        </div>
      )}
    </div>
  );
}

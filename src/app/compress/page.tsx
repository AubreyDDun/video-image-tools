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

  const handleCompress = async () => {
    if (!file) return;

    setStatus('processing');
    setProgress(10);

    try {
      setProgress(30);
      const result = await compressVideo(file, quality / 100);
      setProgress(100);
      setResult(result);
      setStatus('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : '压缩失败');
      setStatus('error');
    }
  };

  const compressionRatio = file && result 
    ? ((1 - result.size / file.size) * 100).toFixed(1) 
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">视频压缩</h1>
        <p className="text-gray-600">
          在线压缩视频文件，减小文件大小，保持画质
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-sm font-medium">本地处理</div>
          <div className="text-xs text-gray-500">文件不上传服务器</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-sm font-medium">快速压缩</div>
          <div className="text-xs text-gray-500">智能压缩算法</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm font-medium">可调质量</div>
          <div className="text-xs text-gray-500">自由控制压缩比</div>
        </div>
      </div>

      {/* Uploader */}
      <FileUploader
        accept="video/*"
        onFileSelect={setFile}
        label="选择视频文件（MP4、MOV、AVI 等）"
      />

      {/* Quality Slider */}
      {file && (
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-700">压缩质量</label>
            <span className="text-blue-600 font-medium">{quality}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>高压缩 (30%)</span>
            <span>低压缩 (100%)</span>
          </div>
          
          {file && (
            <div className="text-sm text-gray-600">
              原文件大小：{(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {file && !result && (
        <button
          onClick={handleCompress}
          disabled={status === 'processing'}
          className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'processing' ? '处理中...' : '开始压缩'}
        </button>
      )}

      {/* Status */}
      <ProcessingStatus
        status={status}
        progress={progress}
        message={status === 'complete' ? `压缩完成！压缩率：${compressionRatio}%` : undefined}
        error={error}
      />

      {/* Download */}
      {result && file && (
        <div className="space-y-4 p-6 bg-green-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">原始大小：</span>
              <span className="font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div>
              <span className="text-gray-500">压缩后：</span>
              <span className="font-medium text-green-600">{(result.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          <DownloadButton
            blob={result.blob}
            filename={`compressed_${file.name}`}
            label="下载压缩后的视频"
            className="w-full justify-center"
          />
        </div>
      )}
    </div>
  );
}

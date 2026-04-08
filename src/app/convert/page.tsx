'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import ProcessingStatus from '@/components/ProcessingStatus';
import DownloadButton from '@/components/DownloadButton';
import { convertVideo } from '@/lib/ffmpeg/videoConvert';

type OutputFormat = 'mp4' | 'webm' | 'avi' | 'mov' | 'gif';

const formatOptions: { value: OutputFormat; label: string; desc: string }[] = [
  { value: 'mp4', label: 'MP4', desc: '最通用，兼容性好' },
  { value: 'webm', label: 'WebM', desc: '网页优化，体积小' },
  { value: 'avi', label: 'AVI', desc: '传统格式' },
  { value: 'mov', label: 'MOV', desc: 'Apple 设备' },
  { value: 'gif', label: 'GIF', desc: '动图格式' },
];

export default function VideoConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<OutputFormat>('mp4');
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [error, setError] = useState<string>('');

  const handleConvert = async () => {
    if (!file) return;

    setStatus('processing');
    setProgress(10);

    try {
      setProgress(30);
      const result = await convertVideo(file, targetFormat);
      setProgress(100);
      setResult(result);
      setStatus('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换失败');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">视频格式转换</h1>
        <p className="text-gray-600">
          在线转换视频格式，支持 MP4、WebM、AVI、MOV、GIF
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
          <div className="text-sm font-medium">快速转换</div>
          <div className="text-xs text-gray-500">多种格式支持</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm font-medium">高质量</div>
          <div className="text-xs text-gray-500">保持原始画质</div>
        </div>
      </div>

      {/* Uploader */}
      <FileUploader
        accept="video/*"
        onFileSelect={setFile}
        label="选择视频文件"
      />

      {/* Format Selection */}
      {file && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">选择目标格式</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {formatOptions.map((format) => (
              <button
                key={format.value}
                onClick={() => setTargetFormat(format.value)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  targetFormat === format.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{format.label}</div>
                <div className="text-xs text-gray-500">{format.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      {file && !result && (
        <button
          onClick={handleConvert}
          disabled={status === 'processing'}
          className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'processing' ? '处理中...' : `转换为 ${targetFormat.toUpperCase()}`}
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
        <div className="space-y-4 p-6 bg-green-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">原始格式：</span>
              <span className="font-medium">{file.name.split('.').pop()?.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-gray-500">转换后：</span>
              <span className="font-medium text-green-600">{targetFormat.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            文件大小：{(result.size / 1024 / 1024).toFixed(2)} MB
          </div>
          <DownloadButton
            blob={result.blob}
            filename={`converted_${file.name.split('.')[0]}.${targetFormat}`}
            label="下载转换后的视频"
            className="w-full justify-center"
          />
        </div>
      )}
    </div>
  );
}

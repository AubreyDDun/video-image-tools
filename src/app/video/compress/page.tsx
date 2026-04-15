'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import FileUploader from '@/components/FileUploader';
import ProcessingStatus from '@/components/ProcessingStatus';
import DownloadButton from '@/components/DownloadButton';
import { compressVideo } from '@/lib/ffmpeg/videoCompress';

export default function VideoCompressPage() {
  const t = useTranslations();
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
    addLog(`Start compressing: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    try {
      const result = await compressVideo(file, quality / 100, (p) => {
        setProgress(p);
        addLog(`Progress: ${p}%`);
      });
      
      setResult(result);
      setStatus('complete');
      addLog(`Compression complete: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (err) {
      console.error('Compression failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Compression failed';
      setError(errMsg);
      setStatus('error');
      addLog(`Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const compressionRatio = file && result 
    ? ((1 - result.size / file.size) * 100).toFixed(1) 
    : null;

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
    return formats[ext || ''] || ext?.toUpperCase() || 'Unknown';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('videoCompress.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t('videoCompress.subtitle')}</p>
      </div>

      {/* Supported Formats */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">📁 {t('videoCompress.supportedFormats')}：</h3>
        <div className="flex flex-wrap gap-2">
          {['MP4', 'MOV', 'AVI', 'WebM', 'MKV', 'M4V', 'HEVC/H.265', '3GP', 'WMV', 'FLV'].map((fmt) => (
            <span key={fmt} className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-700">
              {fmt}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          💡 {t('videoCompress.outputFormat')}
        </p>
      </div>

      {/* File Uploader */}
      <FileUploader
        accept="video/*"
        label={t('videoCompress.uploadLabel')}
        onFileSelect={(f) => setFile(f)}
      />

      {/* Quality Slider */}
      {file && !result && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-900 dark:text-white">
              {t('videoCompress.quality')}
            </label>
            <span className="text-sm text-gray-600 dark:text-gray-300">{quality}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{t('videoCompress.highCompression')}</span>
            <span>{t('videoCompress.lowCompression')}</span>
          </div>

          {/* File Info */}
          <div className="pt-4 border-t dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t('videoCompress.originalSize')}：</span>
                <span className="text-gray-900 dark:text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t('videoCompress.fileFormat')}：</span>
                <span className="text-gray-900 dark:text-white">{getVideoFormat(file.name)}</span>
              </div>
            </div>
          </div>

          {/* Compress Button */}
          <button
            onClick={handleCompress}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? t('common.processing') : t('videoCompress.startCompress')}
          </button>
        </div>
      )}

      {/* Processing Status */}
      {status === 'processing' && (
        <ProcessingStatus status="processing" progress={progress} message={t('common.processing')} />
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('videoCompress.originalSize')}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{(file!.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('videoCompress.compressedSize')}</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{(result.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          
          {compressionRatio && (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('videoCompress.compressionRatio')}</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {t('videoCompress.spaceSaved', { ratio: compressionRatio })}
              </p>
            </div>
          )}

          <DownloadButton blob={result.blob} filename={`compressed_${file!.name}`} />
          
          <button
            onClick={() => {
              setFile(null);
              setResult(null);
              setStatus('idle');
            }}
            className="w-full py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('videoCompress.compressAnother')}
          </button>
        </div>
      )}

      {/* Debug Log */}
      {debugLog.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
            Debug Log ({debugLog.length} entries)
          </summary>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-xs text-gray-700 dark:text-gray-300 max-h-64 overflow-y-auto">
            {debugLog.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

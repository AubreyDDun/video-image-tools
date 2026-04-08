'use client';

interface DownloadButtonProps {
  blob: Blob;
  filename: string;
  label?: string;
  className?: string;
}

export default function DownloadButton({ 
  blob, 
  filename, 
  label = '下载文件',
  className = ''
}: DownloadButtonProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className={`inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ${className}`}
    >
      <span>⬇️</span>
      {label}
    </button>
  );
}

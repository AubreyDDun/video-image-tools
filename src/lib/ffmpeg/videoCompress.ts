// @ts-ignore - FFmpeg.wasm 0.11.x uses global FFmpeg object
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// 创建 FFmpeg 实例（0.11.x API）
const ffmpeg = createFFmpeg({
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
  log: false,
});

export async function compressVideo(
  file: File,
  quality: number = 0.7,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; size: number }> {
  try {
    onProgress?.(5);
    
    // 加载 FFmpeg.wasm
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    
    onProgress?.(15);

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';
    
    onProgress?.(25);
    
    const fileData = await fetchFile(file);
    ffmpeg.FS('writeFile', inputName, fileData);
    
    onProgress?.(35);

    const crf = Math.round(18 + (1 - quality) * 23);
    
    onProgress?.(40);
    
    ffmpeg.setProgress(({ ratio }) => {
      const progress = Math.min(40 + ratio * 50, 95);
      onProgress?.(progress);
    });
    
    await ffmpeg.run(
      '-i', inputName,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', crf.toString(),
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      outputName
    );
    
    onProgress?.(90);

    const outputData = ffmpeg.FS('readFile', outputName);
    const blob = new Blob([outputData.buffer as ArrayBuffer], { type: 'video/mp4' });
    
    onProgress?.(95);
    
    ffmpeg.FS('unlink', inputName);
    ffmpeg.FS('unlink', outputName);
    
    onProgress?.(100);

    return {
      blob,
      size: blob.size,
    };
  } catch (error) {
    console.error('[视频压缩] 失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    throw new Error(`视频压缩失败：${errorMessage}`);
  }
}

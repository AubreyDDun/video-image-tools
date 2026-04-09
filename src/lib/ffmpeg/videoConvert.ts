// @ts-ignore - FFmpeg.wasm 0.11.x uses global FFmpeg object
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
  log: false,
});

type OutputFormat = 'mp4' | 'webm' | 'avi' | 'mov' | 'gif';

export async function convertVideo(
  file: File,
  format: OutputFormat,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; size: number }> {
  try {
    onProgress?.(5);
    
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    
    onProgress?.(15);

    const inputName = 'input';
    const outputName = `output.${format}`;
    
    onProgress?.(25);
    
    const fileData = await fetchFile(file);
    ffmpeg.FS('writeFile', inputName, fileData);
    
    onProgress?.(35);

    const args: string[] = ['-i', inputName];
    
    if (format === 'gif') {
      args.push('-vf', 'fps=10,scale=320:-1:flags=lanczos', '-c:v', 'gif');
    } else if (format === 'webm') {
      args.push('-c:v', 'libvpx-vp9', '-c:a', 'libopus');
    } else if (format === 'mp4') {
      args.push('-c:v', 'libx264', '-preset', 'medium', '-c:a', 'aac');
    } else {
      args.push('-c:v', 'mpeg4', '-c:a', 'aac');
    }
    
    args.push(outputName);
    
    onProgress?.(40);
    
    ffmpeg.setProgress(({ ratio }) => {
      const progress = Math.min(35 + ratio * 60, 95);
      onProgress?.(progress);
    });

    await ffmpeg.run(...args);
    
    onProgress?.(90);

    const outputData = ffmpeg.FS('readFile', outputName);
    const mimeType = format === 'gif' ? 'image/gif' : `video/${format}`;
    const blob = new Blob([outputData.buffer as ArrayBuffer], { type: mimeType });
    
    onProgress?.(95);
    
    ffmpeg.FS('unlink', inputName);
    ffmpeg.FS('unlink', outputName);
    
    onProgress?.(100);

    return {
      blob,
      size: blob.size,
    };
  } catch (error) {
    console.error('[视频转换] 失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    throw new Error(`视频转换失败：${errorMessage}`);
  }
}

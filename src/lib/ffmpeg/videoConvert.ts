import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

type OutputFormat = 'mp4' | 'webm' | 'avi' | 'mov' | 'gif';

// 使用 core-mt（多线程版本，支持 H.264/HEVC 等更多编解码器）
const CORE_URL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/esm/ffmpeg-core.js';
const WASM_URL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/esm/ffmpeg-core.wasm';

export async function convertVideo(
  file: File,
  format: OutputFormat
): Promise<{ blob: Blob; size: number }> {
  const ffmpeg = new FFmpeg();
  
  try {
    await ffmpeg.load({
      coreURL: CORE_URL,
      wasmURL: WASM_URL,
    });

    const inputName = 'input';
    const outputName = `output.${format}`;
    
    ffmpeg.writeFile(inputName, await fetchFile(file));

    // 根据格式调整参数
    const args: string[] = ['-i', inputName];
    
    if (format === 'gif') {
      args.push(
        '-vf', 'fps=10,scale=320:-1:flags=lanczos',
        '-c:v', 'gif'
      );
    } else if (format === 'webm') {
      args.push('-c:v', 'libvpx-vp9', '-c:a', 'libopus');
    } else if (format === 'mp4') {
      // MP4 使用 H.264（支持 iPhone HEVC 输入）
      args.push(
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-c:a', 'aac'
      );
    } else {
      args.push('-c:v', 'mpeg4', '-c:a', 'aac');
    }
    
    args.push(outputName);

    await ffmpeg.exec(args);

    const outputData = await ffmpeg.readFile(outputName);
    const mimeType = format === 'gif' ? 'image/gif' : `video/${format}`;
    const uint8Array = outputData as Uint8Array;
    const arrayBuffer = uint8Array.buffer.slice(
      uint8Array.byteOffset,
      uint8Array.byteOffset + uint8Array.byteLength
    ) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: mimeType });
    
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
    await ffmpeg.terminate();

    return {
      blob,
      size: blob.size,
    };
  } catch (error) {
    console.error('视频转换失败:', error);
    try {
      await ffmpeg.terminate();
    } catch (e) {
      // 忽略 terminate 错误
    }
    throw new Error(`视频转换失败：${error instanceof Error ? error.message : '未知错误'}`);
  }
}

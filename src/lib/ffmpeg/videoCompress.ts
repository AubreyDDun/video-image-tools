import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// 使用 core-mt（多线程版本，支持 H.264/HEVC 等更多编解码器）
const CORE_URL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/esm/ffmpeg-core.js';
const WASM_URL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/esm/ffmpeg-core.wasm';

export async function compressVideo(
  file: File,
  quality: number = 0.7
): Promise<{ blob: Blob; size: number }> {
  const ffmpeg = new FFmpeg();
  
  try {
    // 加载 FFmpeg.wasm（多线程版本）
    await ffmpeg.load({
      coreURL: CORE_URL,
      wasmURL: WASM_URL,
    });

    // 写入文件
    const inputName = 'input.mp4';
    const outputName = 'output.mp4';
    
    ffmpeg.writeFile(inputName, await fetchFile(file));

    // 压缩参数（CRF 越高质量越低，文件越小）
    // H.264 CRF 范围：0-51，推荐 18-28
    const crf = Math.round(18 + (1 - quality) * 23);
    
    // 执行压缩（使用 H.264 编解码器）
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', crf.toString(),
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      outputName
    ]);

    // 读取输出
    const outputData = await ffmpeg.readFile(outputName);
    const uint8Array = outputData as Uint8Array;
    const arrayBuffer = uint8Array.buffer.slice(
      uint8Array.byteOffset,
      uint8Array.byteOffset + uint8Array.byteLength
    ) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
    
    // 清理
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
    await ffmpeg.terminate();

    return {
      blob,
      size: blob.size,
    };
  } catch (error) {
    console.error('视频压缩失败:', error);
    try {
      await ffmpeg.terminate();
    } catch (e) {
      // 忽略 terminate 错误
    }
    throw new Error(`视频压缩失败：${error instanceof Error ? error.message : '未知错误'}`);
  }
}

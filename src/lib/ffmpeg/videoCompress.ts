import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const CORE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js';
const WASM_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm';

export async function compressVideo(
  file: File,
  quality: number = 0.7
): Promise<{ blob: Blob; size: number }> {
  const ffmpeg = new FFmpeg();
  
  // 加载 FFmpeg.wasm
  await ffmpeg.load({
    coreURL: CORE_URL,
    wasmURL: WASM_URL,
  });

  // 写入文件
  const inputName = 'input.mp4';
  const outputName = 'output.mp4';
  
  ffmpeg.writeFile(inputName, await fetchFile(file));

  // 压缩参数（CRF 越高质量越低，文件越小）
  const crf = Math.round(28 + (1 - quality) * 23); // 28-51
  
  // 执行压缩
  await ffmpeg.exec([
    '-i', inputName,
    '-c:v', 'libx264',
    '-crf', crf.toString(),
    '-c:a', 'aac',
    '-b:a', '128k',
    outputName
  ]);

  // 读取输出
  const outputData = await ffmpeg.readFile(outputName);
  // 确保是 Uint8Array 类型并创建 ArrayBuffer 拷贝
  const uint8Array = outputData as Uint8Array;
  const arrayBuffer = uint8Array.buffer.slice(
    uint8Array.byteOffset,
    uint8Array.byteOffset + uint8Array.byteLength
  ) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
  
  // 清理
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return {
    blob,
    size: blob.size,
  };
}

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

type OutputFormat = 'mp4' | 'webm' | 'avi' | 'mov' | 'gif';

const CORE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js';
const WASM_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm';

export async function convertVideo(
  file: File,
  format: OutputFormat
): Promise<{ blob: Blob; size: number }> {
  const ffmpeg = new FFmpeg();
  
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
  } else {
    args.push('-c:v', 'libx264', '-c:a', 'aac');
  }
  
  args.push(outputName);

  await ffmpeg.exec(args);

  const outputData = await ffmpeg.readFile(outputName);
  const mimeType = format === 'gif' ? 'image/gif' : `video/${format}`;
  // 确保是 Uint8Array 类型并创建 ArrayBuffer 拷贝
  const uint8Array = outputData as Uint8Array;
  const arrayBuffer = uint8Array.buffer.slice(
    uint8Array.byteOffset,
    uint8Array.byteOffset + uint8Array.byteLength
  ) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: mimeType });
  
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return {
    blob,
    size: blob.size,
  };
}

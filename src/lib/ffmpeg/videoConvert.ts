import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

type OutputFormat = 'mp4' | 'webm' | 'avi' | 'mov' | 'gif';

export async function convertVideo(
  file: File,
  format: OutputFormat
): Promise<{ blob: Blob; size: number }> {
  const ffmpeg = new FFmpeg();
  
  await ffmpeg.load({
    coreURL: await fetchFile(
      'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js'
    ),
    wasmURL: await fetchFile(
      'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm'
    ),
  });

  const inputName = 'input';
  const outputName = `output.${format}`;
  
  ffmpeg.writeFile(`${inputName}`, await fetchFile(file));

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
  const blob = new Blob([outputData], { type: mimeType });
  
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return {
    blob,
    size: blob.size,
  };
}

import multer from 'multer';
import nextConnect from 'next-connect';
import ffmpeg from 'fluent-ffmpeg';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('video'));

apiRoute.post(async (req, res) => {
  const { buffer } = req.file;
  const tempFilePath = path.join('/tmp', `${uuidv4()}.mp4`);
  const outputPath = path.join('/tmp', `${uuidv4()}_compressed.mp4`);

  try {
    await writeFile(tempFilePath, buffer);
    const ffmpegProcess = ffmpeg(tempFilePath)
      .output(outputPath)
      .outputOptions('-vcodec', 'libx264')
      .outputOptions('-crf', '28')
      .on('progress', (progress) => {
        const percentage = Math.round(progress.percent);
        res.write(`data: ${percentage}\n\n`);
      })
      .on('end', async () => {
        await unlink(tempFilePath); // Clean up the input file
        res.write(`data: complete\n\n`);
        res.end();
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      });

    req.on('close', () => {
      ffmpegProcess.kill('SIGKILL');
    });

    ffmpegProcess.run();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};

import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: 'gaiia',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm'],
    };
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// --- ПЕТИЦІЇ ---
app.get('/api/petitions', async (req, res) => {
  const data = await prisma.petition.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(data);
});

app.post('/api/petitions', async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const result = await prisma.petition.create({
    data: { firstName, lastName, email }
  });
  res.json(result);
});

// --- КОНТЕНТ ---
app.get('/api/content', async (req, res) => {
  const content = await prisma.content.findMany();
  res.json(content);
});

app.post('/api/content', async (req, res) => {
  const { id, value } = req.body;
  const result = await prisma.content.upsert({
    where: { id },
    update: { value },
    create: { id, value }
  });
  res.json(result);
});

// --- ЗАВАНТАЖЕННЯ МЕДІА НА CLOUDINARY ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const url = req.file.path;
    const { contentId } = req.body;

    if (contentId) {
      await prisma.content.upsert({
        where: { id: contentId },
        update: { value: url },
        create: { id: contentId, value: url }
      });
    }

    res.json({ url, public_id: req.file.filename });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// --- СПИСОК МЕДІА З CLOUDINARY ---
app.get('/api/media', async (req, res) => {
  try {
    const [images, videos] = await Promise.all([
      cloudinary.api.resources({ type: 'upload', prefix: 'gaiia', resource_type: 'image', max_results: 50 }),
      cloudinary.api.resources({ type: 'upload', prefix: 'gaiia', resource_type: 'video', max_results: 50 }),
    ]);
    res.json({ images: images.resources, videos: videos.resources });
  } catch (err) {
    console.error('Media list error:', err);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// --- РОЗДАЧА REACT FRONTEND (dist папка після npm run build) ---
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback — всі маршрути (/admin тощо) повертають index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
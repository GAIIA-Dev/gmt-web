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

// Налаштування для Railway, щоб правильно бачити IP користувача
app.set('trust proxy', true);

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

  try {
    // 1. Отримуємо IP юзера
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip && ip.includes(',')) ip = ip.split(',')[0];
    if (ip === '::1' || ip === '127.0.0.1') ip = ''; 

    // 2. Визначаємо країну по IP
    let country = 'Unknown';
    try {
      if (ip) {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
        const geoData = await geoRes.json();
        if (geoData.status === 'success') {
          country = geoData.country; // Отримаємо щось типу "Ukraine", "United States"
        }
      }
    } catch (err) {
      console.log('Помилка визначення локації:', err.message);
    }

    // 3. Зберігаємо у вашу базу даних (Prisma)
    const result = await prisma.petition.create({
  data: { firstName, lastName, email, country }
});

    // 4. Відправляємо дані в BEEHIIV (з країною)
    const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
    const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUB_ID;

    if (BEEHIIV_API_KEY && BEEHIIV_PUB_ID) {
      const beehiivPayload = {
        email: email,
        reactivate_existing: false,
        send_welcome_email: false,
        custom_fields: [
          { name: "First Name", value: firstName },
          { name: "Last Name", value: lastName },
          { name: "Country", value: country } // Передаємо країну!
        ]
      };

      try {
        const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(beehiivPayload)
        });

        if (!beehiivResponse.ok) {
          console.error('Помилка відправки в Beehiiv:', await beehiivResponse.text());
        } else {
          console.log(`Успішно відправлено в Beehiiv: ${email}, Країна: ${country}`);
        }
      } catch (beehiivErr) {
        console.error('Мережева помилка Beehiiv:', beehiivErr.message);
      }
    } else {
      console.warn('Пропущено відправку в Beehiiv: немає ключів у Railway Variables');
    }

    // Віддаємо успішну відповідь на фронтенд (щоб показалась зелена галочка)
    res.json(result);

  } catch (error) {
    console.error('Помилка збереження петиції:', error);
    res.status(500).json({ error: 'Failed to save petition' });
  }
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
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
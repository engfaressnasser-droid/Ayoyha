import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Increase JSON body limit to support base64 photos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const MEMORIES_FILE = path.join(DATA_DIR, 'memories.json');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded assets
app.use('/uploads', express.static(UPLOADS_DIR));

// GET /api/config - Return persistent configuration
app.get('/api/config', (_req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return res.json({ success: true, config: JSON.parse(data) });
    }
    return res.json({ success: true, config: null });
  } catch (err) {
    console.error('Error reading config file:', err);
    return res.status(500).json({ success: false, error: 'Failed to read server configuration' });
  }
});

// POST /api/config - Permanently save configuration
app.post('/api/config', (req, res) => {
  try {
    const config = req.body;
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid config payload' });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    return res.json({ success: true, message: 'Configuration saved permanently on server' });
  } catch (err) {
    console.error('Error saving config file:', err);
    return res.status(500).json({ success: false, error: 'Failed to save configuration' });
  }
});

// GET /api/memories - Return persistent photo album
app.get('/api/memories', (_req, res) => {
  try {
    if (fs.existsSync(MEMORIES_FILE)) {
      const data = fs.readFileSync(MEMORIES_FILE, 'utf-8');
      return res.json({ success: true, memories: JSON.parse(data) });
    }
    return res.json({ success: true, memories: [] });
  } catch (err) {
    console.error('Error reading memories file:', err);
    return res.status(500).json({ success: false, error: 'Failed to read memories' });
  }
});

// POST /api/memories - Permanently save photo album
app.post('/api/memories', (req, res) => {
  try {
    const memories = req.body;
    if (!Array.isArray(memories)) {
      return res.status(400).json({ success: false, error: 'Memories payload must be an array' });
    }
    fs.writeFileSync(MEMORIES_FILE, JSON.stringify(memories, null, 2), 'utf-8');
    return res.json({ success: true, count: memories.length, message: 'Memories saved permanently on server' });
  } catch (err) {
    console.error('Error saving memories file:', err);
    return res.status(500).json({ success: false, error: 'Failed to save memories' });
  }
});

// POST /api/upload-image - Save uploaded photo directly to disk and return static URL
app.post('/api/upload-image', (req, res) => {
  try {
    const { dataUrl, fileName } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing dataUrl in request' });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, error: 'Invalid base64 dataUrl format' });
    }

    const mime = matches[1];
    let ext = mime.split('/')[1] || 'jpg';
    if (ext === 'jpeg') ext = 'jpg';
    ext = ext.replace(/[^a-zA-Z0-9]/g, '');

    const safeName = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    const buffer = Buffer.from(matches[2], 'base64');
    fs.writeFileSync(filePath, buffer);

    return res.json({
      success: true,
      url: `/uploads/${safeName}`,
      fileName: fileName || safeName,
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    return res.status(500).json({ success: false, error: 'Failed to store image' });
  }
});

// POST /api/reset - Keep permanent server data protected
app.post('/api/reset', (_req, res) => {
  return res.json({ success: true, message: 'Server data is permanently protected' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express + Vite server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

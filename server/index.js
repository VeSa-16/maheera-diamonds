import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([]));
}
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([]));
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

// GET inquiries
app.get('/api/inquiries', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
    res.json(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read inquiries' });
  }
});

// POST new inquiry
app.post('/api/inquiries', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
    const newInquiry = {
      id: generateId(),
      created_at: new Date().toISOString(),
      status: 'New',
      stage: 'New Lead',
      notes: [],
      ...req.body,
    };
    data.push(newInquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newInquiry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
});

// PATCH update inquiry status
app.patch('/api/inquiries/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
    const index = data.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Inquiry not found' });
    
    data[index] = { ...data[index], ...req.body };
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// --- PRODUCTS API ---

// GET products
app.get('/api/products', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// POST new product
app.post('/api/products', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    const newProduct = {
      id: `m-prod-${generateId()}`,
      ...req.body,
    };
    data.push(newProduct);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// PATCH update product
app.patch('/api/products/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    const index = data.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    
    data[index] = { ...data[index], ...req.body };
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    const filteredData = data.filter(p => p.id !== req.params.id);
    
    if (data.length === filteredData.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filteredData, null, 2));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

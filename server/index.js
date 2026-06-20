import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

const JWT_SECRET = process.env.JWT_SECRET || 'maheera-super-secret-key-dev-only';

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
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

// Setup Nodemailer Transporter (using Ethereal for testing)
let transporter;
nodemailer.createTestAccount().then(account => {
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });
  console.log('Test Email Account Created. User:', account.user);
}).catch(err => {
  console.error('Failed to create test email account:', err);
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION API ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: generateId(),
      name,
      email,
      password: hashedPassword,
      favorites: []
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user without password
    res.status(201).json({ token, name: newUser.name, email: newUser.email, favorites: newUser.favorites });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, name: user.name, email: user.email, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- USER API ---

app.get('/api/user/me', authenticateToken, (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.sendStatus(404);
    res.json({ name: user.name, email: user.email, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

app.post('/api/user/favorites', authenticateToken, (req, res) => {
  try {
    const { favorites } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) return res.sendStatus(404);
    
    users[userIndex].favorites = favorites;
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    
    res.json({ favorites: users[userIndex].favorites });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update favorites' });
  }
});


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
app.post('/api/inquiries', async (req, res) => {
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
    
    // Send confirmation email
    if (transporter && newInquiry.email) {
      try {
        const info = await transporter.sendMail({
          from: '"Maheera Diamonds" <concierge@maheeradiamonds.com>',
          to: newInquiry.email,
          subject: 'Your Inquiry has been Received',
          text: `Dear ${newInquiry.name || 'Client'},\n\nThank you for reaching out to Maheera Diamonds. We have received your inquiry and our VIP Concierge will be in touch shortly.\n\nWarm regards,\nMaheera Diamonds`,
          html: `<p>Dear ${newInquiry.name || 'Client'},</p><p>Thank you for reaching out to <strong>Maheera Diamonds</strong>. We have received your inquiry and our VIP Concierge will be in touch shortly.</p><br/><p>Warm regards,<br/>Maheera Diamonds</p>`
        });
        console.log('Email sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      } catch (emailErr) {
        console.error('Failed to send email:', emailErr);
      }
    }

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

// --- ORDERS API ---

// GET all orders (for admin dashboard)
app.get('/api/orders', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    res.json(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

// POST new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      user_id: req.user.id,
      client: req.user.email, // In a real app we'd fetch full user details
      created_at: new Date().toISOString(),
      status: 'At Bench',
      items,
      value: total
    };
    
    // Fetch user for name to send email
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find(u => u.id === req.user.id);
    if (user) {
      newOrder.client = user.name;
    }

    data.push(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2));

    // Send confirmation email
    if (transporter && req.user.email) {
      try {
        const info = await transporter.sendMail({
          from: '"Maheera Diamonds" <concierge@maheeradiamonds.com>',
          to: req.user.email,
          subject: `Order Confirmation: ${newOrder.id}`,
          text: `Dear ${newOrder.client},\n\nYour bespoke commission ${newOrder.id} has been securely received and is now 'At Bench'.\n\nTotal: ₹${total.toLocaleString('en-IN')}\n\nWarm regards,\nMaheera Diamonds`,
          html: `<p>Dear ${newOrder.client},</p><p>Your bespoke commission <strong>${newOrder.id}</strong> has been securely received and is now 'At Bench'.</p><p>Total: ₹${total.toLocaleString('en-IN')}</p><br/><p>Warm regards,<br/>Maheera Diamonds</p>`
        });
        console.log('Order Email sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      } catch (emailErr) {
        console.error('Failed to send order email:', emailErr);
      }
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET user specific orders
app.get('/api/user/orders', authenticateToken, (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    // Return orders matching the authenticated user's ID
    const userOrders = data.filter(o => o.user_id === req.user.id);
    // Sort descending by date
    userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// PATCH update order status
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    const index = data.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Order not found' });
    
    const oldStatus = data[index].status;
    const newStatus = req.body.status;
    
    data[index] = { ...data[index], ...req.body };
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2));

    // Send tracking email if transitioning to Armored Transit
    if (newStatus === 'Armored Transit' && oldStatus !== 'Armored Transit') {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const user = users.find(u => u.id === data[index].user_id);
      
      if (transporter && user && user.email) {
        try {
          const info = await transporter.sendMail({
            from: '"Maheera Diamonds" <concierge@maheeradiamonds.com>',
            to: user.email,
            subject: `Armored Transit Dispatched: ${data[index].id}`,
            text: `Dear ${data[index].client || 'Client'},\n\nYour bespoke commission ${data[index].id} has cleared GIA Verification and is now in Armored Transit via secure logistics.\n\nYou will be contacted shortly by our courier partner for secure handover.\n\nWarm regards,\nMaheera Diamonds`,
            html: `<p>Dear ${data[index].client || 'Client'},</p><p>Your bespoke commission <strong>${data[index].id}</strong> has cleared GIA Verification and is now in <strong>Armored Transit</strong> via secure logistics.</p><p>You will be contacted shortly by our courier partner for secure handover.</p><br/><p>Warm regards,<br/>Maheera Diamonds</p>`
          });
          console.log('Transit Email sent: %s', info.messageId);
        } catch (emailErr) {
          console.error('Failed to send transit email:', emailErr);
        }
      }
    }

    res.json(data[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// GET analytics
app.get('/api/analytics', (req, res) => {
  try {
    const inquiriesData = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
    
    const inquiriesByStatus = inquiriesData.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    const statusChartData = Object.keys(inquiriesByStatus).map(key => ({
      name: key,
      value: inquiriesByStatus[key]
    }));

    // Mock data for other charts
    const popularShapes = [
      { name: "Round", value: 45 },
      { name: "Oval", value: 30 },
      { name: "Emerald", value: 15 },
      { name: "Pear", value: 10 }
    ];

    const trafficOverTime = [
      { name: "Mon", visitors: 400, pageViews: 1200 },
      { name: "Tue", visitors: 300, pageViews: 900 },
      { name: "Wed", visitors: 550, pageViews: 1800 },
      { name: "Thu", visitors: 480, pageViews: 1400 },
      { name: "Fri", visitors: 600, pageViews: 2100 },
      { name: "Sat", visitors: 800, pageViews: 2900 },
      { name: "Sun", visitors: 750, pageViews: 2500 }
    ];

    res.json({
      totalInquiries: inquiriesData.length,
      inquiriesByStatus: statusChartData,
      popularShapes,
      trafficOverTime
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

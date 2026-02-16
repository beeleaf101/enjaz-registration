import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage (data persists while server is running)
let registrations = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the dist folder (frontend)
app.use(express.static(path.join(__dirname, '../dist')));

// Helper function to read registrations
const readRegistrations = () => {
  return registrations;
};

// Helper function to write registrations
const writeRegistrations = (data) => {
  registrations = data;
  return true;
};

// POST - Save new registration
app.post('/api/register', (req, res) => {
  const { studentId, studentName, phoneNumber } = req.body;

  if (!studentId || !studentName || !phoneNumber) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  const regs = readRegistrations();
  
  const existing = regs.find(r => r.studentId === studentId);
  if (existing) {
    return res.status(409).json({ 
      success: false, 
      message: 'Student ID already registered' 
    });
  }

  const newRegistration = {
    id: Date.now().toString(),
    studentId,
    studentName,
    phoneNumber,
    registeredAt: new Date().toISOString()
  };

  regs.push(newRegistration);
  
  if (writeRegistrations(regs)) {
    res.json({ 
      success: true, 
      message: 'Registration successful',
      data: newRegistration
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save registration' 
    });
  }
});

// GET - All registrations
app.get('/api/registrations', (req, res) => {
  const regs = readRegistrations();
  res.json({ 
    success: true, 
    count: regs.length,
    data: regs
  });
});

// GET - Single registration by ID
app.get('/api/registrations/:id', (req, res) => {
  const regs = readRegistrations();
  const registration = regs.find(r => r.id === req.params.id);
  
  if (!registration) {
    return res.status(404).json({ 
      success: false, 
      message: 'Registration not found' 
    });
  }
  
  res.json({ 
    success: true, 
    data: registration
  });
});

// DELETE - Delete registration
app.delete('/api/registrations/:id', (req, res) => {
  const regs = readRegistrations();
  const index = regs.findIndex(r => r.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Registration not found' 
    });
  }
  
  regs.splice(index, 1);
  
  if (writeRegistrations(regs)) {
    res.json({ 
      success: true, 
      message: 'Registration deleted successfully'
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete registration' 
    });
  }
});

// Serve index.html for all other routes (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  POST /api/register - Register a new student`);
  console.log(`  GET  /api/registrations - Get all registrations`);
  console.log(`  DELETE /api/registrations/:id - Delete a registration`);
});

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000; // You can change this to your preferred port

// MySQL configuration
const db = mysql.createConnection({
  host: 'Aditya',
  user: 'aditya',
  password: 'Stayhigh@007',
  database: 'employee_db',
  insecureAuth: true 
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(bodyParser.json());
app.use(cors());

// Create new employee
app.post('/api/employee', (req, res) => {
  const { name, role } = req.body;
  const query = 'INSERT INTO employees (name, role) VALUES (?, ?)';
  db.query(query, [name, role], (err, result) => {
    if (err) {
      console.error('Error creating employee:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.status(201).json({ message: 'Employee created successfully', id: result.insertId });
      console.log({name, role})
    }
  });
});

// Retrieve all employees
app.get('/api/employee', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.error('Error retrieving employees:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});

// Retrieve an employee by ID
app.get('/api/employee/:id', (req, res) => {
  const employeeId = req.params.id;
  db.query('SELECT * FROM employees WHERE id = ?', [employeeId], (err, results) => {
    if (err) {
      console.error('Error retrieving employee:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Update an employee by ID
app.put('/api/employee/:id', (req, res) => {
  const employeeId = req.params.id;
  const { name, role } = req.body;
  const query = 'UPDATE employees SET name = ?, role = ? WHERE id = ?';
  db.query(query, [name, role, employeeId], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.json({ message: 'Employee updated successfully' });
    }
  });
});


// Delete an employee by ID
app.delete('/api/employee/:id', (req, res) => {
  const employeeId = req.params.id;
  db.query('DELETE FROM employees WHERE id = ?', [employeeId], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.json({ message: 'Employee deleted successfully' });
    }
  });
});

// Delete all employees
app.delete('/api/employee', (req, res) => {
  db.query('DELETE FROM employees', (err, result) => {
    if (err) {
      console.error('Error deleting employees:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json({ message: 'All employees deleted successfully' });
    }
  });
});

// Find employees by name
app.get('/api/employee', (req, res) => {
  const keyword = req.query.Name;
  db.query('SELECT * FROM employees WHERE name LIKE ?', [`%${keyword}%`], (err, results) => {
    if (err) {
      console.error('Error finding employees:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

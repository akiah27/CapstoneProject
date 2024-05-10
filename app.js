const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'yourdatabase'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Serve sign-up page
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/newmember.html');
});

// Serve sign-in page
app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/CapstoneWebsite.html');
});

// Handle sign-up form submission
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Check if username already exists
  connection.query('SELECT * FROM login_information WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).send('Error querying database');
      return;
    }

    if (results.length > 0) {
      // If username already exists, display error message
      res.send('email already exists. Please choose a different username.');
    } else {
      // Insert new user into database
      const sql = 'INSERT INTO login_information (email, password) VALUES (?,?)'; 
     const values = [email, password];
      console.log('SQL Query"', sql); 
      console.log('Values:', values); 
      connection.query(sql, values , (error, results) => { 
        if (error) {
          console.error('Error inserting into database:', error);
          res.status(500).send('Error inserting into database');
          return;
        }
        // Redirect user to sign-in page after successful sign-up
        res.redirect('/signin');
      });
    }
  });
});

// Handle sign-in form submission
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // Query MySQL database to check if credentials are valid
  connection.query('SELECT * FROM login_information WHERE email = ? AND password = ?', [email, password], (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).send('Error querying database');
      return;
    }

    if (results.length === 0) {
      // If no matching record found, display error message or redirect back to sign-in page
      res.send('Invalid email or password');
    } else {
      // If matching record found, redirect user to dashboard or another page
      res.redirect('/dashboard');
    }
  });
});

// Handle dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/banking.html'); // Serve the dashboard HTML file
});


 
 
// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

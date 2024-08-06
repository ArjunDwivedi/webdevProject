const path = require('path');
const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow requests from this origin
    credentials: true // Allow cookies to be sent and received
}));

// Session setup
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // Session expiration time
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Arjun@mysql',
    database: 'mywebappdb',
    port: 3306
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Registration route
app.post('/register', (req, res) => {
    const { fullname, email, password } = req.body;

    console.log(`Registration attempt with email: ${email}`);

    // Check if email is already registered
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        // if (err) {
        //     console.error('Error checking email:', err.stack);
        //     res.status(500).json({ success: false, message: 'An error occurred during registration.' });
        //     return;
        // }
        // if (results.length > 0) {
        //     console.log('Email already registered.');
        //     return res.status(400).json({ success: false, message: 'Email already registered.' });
        // }

        // Insert new user
        db.query('INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)', [fullname, email, password], (err, results) => {
            // if (err) {
            //     console.error('Error inserting user:', err.stack);
            //     res.status(500).json({ success: false, message: 'An error occurred during registration.' });
            //     return;
            // }
            console.log('User registered successfully.');
            res.status(201).json({ success: true, message: 'Registration successful!' });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log(`Login attempt with email: ${email}`);

    // Check user credentials
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            console.error('Error checking credentials:', err.stack);
            res.status(500).json({ success: false, message: 'An error occurred during login.' });
            return;
        }
        if (results.length === 0) {
            console.log('Invalid email or password.');
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Set session
        req.session.user = { id: results[0].id, fullname: results[0].fullname, email: results[0].email };
        console.log('Login successful. User session created:', req.session.user);
        res.status(200).json({ success: true, message: 'Login successful!' });
    });
});

// User info route
app.get('/user-info', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Not logged in' });
    }
    console.log('User info requested:', req.session.user);
    res.json({ success: true, user: req.session.user });
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err.stack);
            res.status(500).json({ success: false, message: 'An error occurred during logout.' });
            return;
        }
        console.log('Logout successful.');
        res.status(200).json({ success: true, message: 'Logout successful!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

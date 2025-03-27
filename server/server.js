const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('./db'); // Import database connection
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Generate a random 64-byte secret key for sessions
const secretKey = crypto.randomBytes(64).toString('hex');

// Middleware Setup
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true } // Set secure to true if using HTTPS
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/?warning=true');
}

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

app.get('/employee', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'employee.html'));
});

// User Authentication Routes
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.user = { email, role: user.role };
                console.log('User role:', user.role);  // Debugging step
                // Make sure to handle the case of trimming spaces and using lowercase
                if (user.role.trim().toLowerCase() === 'employee') {
                    return res.json({ success: true, redirect: '/employee' });  // Redirect to employee page
                } else {
                    return res.json({ success: true, redirect: '/dashboard' });  // Redirect to dashboard page
                }
            }
        }
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const pool = db.pool;
app.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !role) {
        return res.json({ success: false, message: "All fields are required." });
    }

    // Ensure role is either 'user' or 'employee'
    if (role !== 'user' && role !== 'employee') {
        return res.json({ success: false, message: "Invalid role selected." });
    }

    try {
        // Check if the email is already taken
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.json({ success: false, message: "Email is already taken." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database using db.execute
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        const values = [name, email, hashedPassword, role];

        const [result] = await db.execute(sql, values);

        // Send success response after insertion is complete
        console.log('User created successfully:', result);
        res.json({ success: true, message: 'Account created successfully!' }); // Ensure message is included
    } catch (error) {
        console.error('Server error:', error);
        res.json({ success: false, message: "Server error." });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to sign out' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Add Bus API Endpoint
const promisePool = db.pool.promise();

app.post('/api/add-bus', async (req, res) => {
  const { busName, busType, totalSeats, departureLocation, destinationLocation, departureTime, arrivalTime, fare } = req.body;
  
  console.log('Received bus data:', { busName, busType, totalSeats, departureLocation, destinationLocation, departureTime, arrivalTime, fare });

  try {
    const [result] = await promisePool.execute(
      `INSERT INTO buses (bus_name, bus_type, total_seats, departure_location, destination_location, departure_time, arrival_time, fare) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [busName, busType, totalSeats, departureLocation, destinationLocation, departureTime, arrivalTime, fare]
    );

    console.log('Bus added successfully:', result);

    for (let i = 1; i <= totalSeats; i++) {
      await promisePool.execute(
        `INSERT INTO seats (bus_id, seat_number, booked) VALUES (?, ?, ?)`,
        [result.insertId, i, false]
      );
    }

    res.status(200).json({ success: true, message: 'Bus added and seats generated successfully.' });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'This bus already exists. Please check your details.' });
    }
    console.error('Error adding bus:', err);
    res.status(500).json({ success: false, message: 'Error adding bus to the database.' });
  }
});

// Fetch all available buses
app.get('/api/get-buses', async (req, res) => {
  const { departureLocation, destinationLocation } = req.query;

  try {
      let query = 'SELECT * FROM buses WHERE 1=1';
      let params = [];

      if (departureLocation) {
          query += ' AND departure_location = ?';
          params.push(departureLocation);
      }
      if (destinationLocation) {
          query += ' AND destination_location = ?';
          params.push(destinationLocation);
      }

      const [buses] = await promisePool.execute(query, params);

      if (buses.length === 0) {
          return res.json({ success: false, message: 'No buses found for the selected route.' });
      }

      res.json({ success: true, buses });
  } catch (err) {
      console.error('Error fetching buses:', err);
      res.status(500).json({ success: false, message: 'Error fetching buses from the database.' });
  }
});


// Fetch all seats for a given bus
app.get('/api/get-seats', async (req, res) => {
  const { busId, travelDate } = req.query;

  if (!busId) {
      return res.status(400).json({ success: false, message: 'Bus ID is required' });
  }

  try {
      // Get all seats for the selected bus
      const [seats] = await promisePool.execute(
          'SELECT s.id, s.seat_number, ' +
          'CASE WHEN b.id IS NOT NULL THEN TRUE ELSE FALSE END AS booked ' +
          'FROM seats s ' +
          'LEFT JOIN bookings b ON s.id = b.seat_id AND b.travel_date = ? ' +
          'WHERE s.bus_id = ?',
          [travelDate, busId]
      );

      res.json({ success: true, seats });
  } catch (err) {
      console.error('Error fetching seats:', err);
      res.status(500).json({ success: false, message: 'Error retrieving seat data.' });
  }
});

const nodemailer = require('nodemailer');
// ✅ Send email notification
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lihanahmed655@gmail.com', // Change to your email
        pass: 'kaievbuucqqkxgoh'  // Use an app password instead of your actual password
    }
});
app.post('/api/book-seat', async (req, res) => {
    try {
        // ✅ Check if user is logged in
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // ✅ Get the email of the logged-in user
        const userEmail = req.session.user.email; // Get the logged-in user's email from the session

        // ✅ Extract request data
        const { busId, seatNumber, travelDate, paymentAmount } = req.body;

        // ✅ Get seat_id from seats table
        const seatQuery = `SELECT id FROM seats WHERE bus_id = ? AND seat_number = ?`;
        const [seatRows] = await db.execute(seatQuery, [busId, seatNumber]);

        if (seatRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid seat selection' });
        }

        const seatId = seatRows[0].id;

        // ✅ Check if seat is already booked for this date
        const checkQuery = `SELECT id FROM bookings WHERE bus_id = ? AND seat_id = ? AND travel_date = ?`;
        const [existingBooking] = await db.execute(checkQuery, [busId, seatId, travelDate]);

        if (existingBooking.length > 0) {
            return res.status(400).json({ success: false, message: 'Seat already booked for this date!' });
        }

        // ✅ Fetch bus details
        const busQuery = `
            SELECT bus_name, departure_time, arrival_time, departure_location, destination_location, fare 
            FROM buses WHERE id = ?`;
        const [busDetails] = await db.execute(busQuery, [busId]);

        if (busDetails.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid bus selection' });
        }

        const { bus_name, departure_time, arrival_time, departure_location, destination_location, fare } = busDetails[0];

        // ✅ Insert booking
        const insertQuery = `INSERT INTO bookings (bus_id, seat_id, travel_date, payment_amount, departure_location, destination_location) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(insertQuery, [busId, seatId, travelDate, paymentAmount, departure_location, destination_location]);

        // ✅ Send booking confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,  // Use the retrieved userEmail here
            subject: 'Bus Ticket Booking Confirmation',
            html: `
                <h2>Booking Confirmation</h2>
                <p>Your ticket has been successfully booked. Here are your booking details:</p>
                <ul>
                    <li><b>Bus:</b> ${bus_name}</li>
                    <li><b>Seat Number:</b> ${seatNumber}</li>
                    <li><b>Travel Date:</b> ${travelDate}</li>
                    <li><b>Departure:</b> ${departure_location} at ${departure_time}</li>
                    <li><b>Arrival:</b> ${destination_location} at ${arrival_time}</li>
                    <li><b>Fare (TK):</b> ${fare}</li>
                </ul>
                <p>Thank you for choosing our service!</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: 'Booking successful! Confirmation email sent.',
            bookingId: result.insertId
        });

    } catch (error) {
        console.error('Error booking seat:', error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
});

app.get('/api/get-seat-fare', async (req, res) => {
  const { busId } = req.query;

  try {
    const [result] = await promisePool.execute('SELECT fare FROM buses WHERE id = ?', [busId]);

    if (result.length > 0) {
      res.json({ fare: result[0].fare });
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (err) {
    console.error('Error fetching seat fare:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Backend to fetch all bookings (without any filters)
app.get("/api/bookings", async (req, res) => {
    const sql = `
        SELECT bookings.id, bookings.departure_location, bookings.destination_location, 
               bookings.travel_date, bookings.payment_amount, 
               IFNULL(seats.seat_number, 'N/A') AS seat_number, 
               IFNULL(buses.bus_name, 'N/A') AS bus_name
        FROM bookings
        LEFT JOIN seats ON bookings.seat_id = seats.id
        LEFT JOIN buses ON seats.bus_id = buses.id
    `;
    try {
        const [results] = await promisePool.query(sql);
        console.log("API Response:", results); // Log the results here
        res.json(results); // Send results as response
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Edit booking
app.put("/api/bookings/edit", async (req, res) => {
    const { id, field, value } = req.body;

    // Prevent SQL injection by allowing only specific fields
    const allowedFields = ["departure_location", "destination_location", "travel_date"];
    if (!allowedFields.includes(field)) {
        return res.status(400).json({ error: "Invalid field" });
    }

    const sql = `UPDATE bookings SET ${field} = ? WHERE id = ?`;

    try {
        // Using promisePool to update the booking
        await promisePool.query(sql, [value, id]);
        res.json({ message: "Booking updated successfully!" });
    } catch (err) {
        console.error("Error updating booking:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Delete booking
app.delete("/api/bookings/delete", async (req, res) => {
    const { id } = req.body;
    const sql = "DELETE FROM bookings WHERE id = ?";

    try {
        // Using promisePool to delete the booking
        await promisePool.query(sql, [id]);
        res.json({ message: "Booking deleted successfully!" });
    } catch (err) {
        console.error("Error deleting booking:", err);
        return res.status(500).json({ error: err.message });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
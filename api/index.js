const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const cookieParser = require('cookie-parser');



const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

// Routes
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

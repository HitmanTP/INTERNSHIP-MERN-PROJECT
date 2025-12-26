const express = require('express');

// Routers
const userRouter = require('./routes/user');

// Middleware
const app = express();
const authUser = require('./utils/auth');
app.use(express.json());

// Apply Authentication Globally
app.use(authUser);

// Mount Routes
app.use('/user', userRouter);

app.listen(4000, 'localhost', () => {
    console.log('Server is running on port 4000');
});
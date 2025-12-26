const express = require('express');

// Middleware
const app = express();
app.use(express.json());

app.listen(4000, 'localhost', () => {
    console.log('Server is running on port 4000');
});
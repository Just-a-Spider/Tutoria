const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/client/browser')));

// Send all requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/client/browser/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const ConnRoutes = require('./Routes/ConnRoutes');
const PetRoutes = require('./Routes/PetRoutes');
const app = express();

app.use(express.json());

app.use('/', ConnRoutes, PetRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
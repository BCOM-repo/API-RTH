const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');


// Middleware para analizar JSON
app.use(express.json());

app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importa las rutas
const routes = require('./routes');
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

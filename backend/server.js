const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "biblioteca_virtual"
});

db.connect((err) => {
    if (err) {
        console.log("Error al conectar a la base de datos:", err.message);
        return;
    }
    console.log("Conectado a la base de datos MySQL");
});

app.get("/", (req, res) => {
    res.send("Servidor de Biblioteca Virtual funcionando 🚀");
});

app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});


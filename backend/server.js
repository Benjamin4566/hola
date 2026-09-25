const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

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

app.post("/registro", async (req, res) => {

    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
        return res.status(400).json({
            mensaje: "Faltan datos"
        });
    }

    try {

        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

        const sql = `
            INSERT INTO usuarios (usuario, contraseña)
            VALUES (?, ?)
        `;

        db.query(
            sql,
            [usuario, contraseñaEncriptada],
            (err, resultado) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({
                            mensaje: "Ese usuario ya existe"
                        });
                    }

                    console.log("Error al registrar:", err.message);

                    return res.status(500).json({
                        mensaje: "Error al registrar usuario"
                    });
                }

                res.json({
                    mensaje: "Usuario creado correctamente",
                    id: resultado.insertId
                });
            }
        );

    } catch (error) {

        console.log("Error:", error.message);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});


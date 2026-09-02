const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "biblioteca_virtual"
});

db.connect((err) => {
    if (err) {
        console.log("Error al conectar con MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");
});

app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

app.post("/registro", (req, res) => {

    const { usuarios, password } = req.body;

    const sql =
    "INSERT INTO usuarios (usuarios, password) VALUES (?, ?)";

    db.query(sql, [usuarios, password], (err) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al registrar"
            });
        }

        res.json({
            mensaje: "Usuarios creado correctamente"
        });

    });

});

app.post("/login", (req, res) => {

    const { usuarios, password } = req.body;

    const sql = "SELECT * FROM usuarios WHERE usuarios = ? AND password = ?";

    db.query(sql, [usuarios, password], (err, result) => {

        if (err) {
            console.error("Error SQL:",err);
            return res.status(500).json({
                success: false,
                mensaje: "Error del servidor"
            });
        }

        if (result.length > 0 ||result.affectedRows > 0) {
            res.json({
                success: true,
                mensaje: "Bienvenido"
            });
        } else {
            res.json({
                success: false,
                mensaje: "Usuarios o password incorrectos"
            });
        }

    });

});

app.post("/libros", (req, res) => {

    const { titulo, descripcion, portada, categorias, autor_id } = req.body;

    const sql = `
    INSERT INTO libros
    (titulo, descripcion, portada, categorias, autor_id)
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [titulo, descripcion, portada, categorias, autor_id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    mensaje: "Error al guardar libro"
                });
            }

            res.json({
                mensaje: "Libro guardado correctamente"
            });

        }
    );

});

app.get("/libros", (req, res) => {

    const sql = "SELECT * FROM libros";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return
             res.status(500).json({
                mensaje: "Error al obtener libros"
            });
        }

        res.json(result);

    });

});


app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

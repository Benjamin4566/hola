// ======================
// VARIABLES GLOBALES
// ======================

let libros = JSON.parse(localStorage.getItem("libros")) || [];
let libroActual = null;

// ======================
// SISTEMA DE CUENTAS
// ======================

if (!localStorage.getItem("cuentaUsuario")) {
    localStorage.setItem("cuentaUsuario", "admin");
    localStorage.setItem("cuentaPass", "1234");
}

// ======================
// LOGIN
// ======================

function login() {

    const usuario =
        document.getElementById("user").value;

    const password =
        document.getElementById("pass").value;

    const usuarioGuardado =
        localStorage.getItem("cuentaUsuario");

    const passGuardada =
        localStorage.getItem("cuentaPass");

    if (
        usuario === usuarioGuardado &&
        password === passGuardada
    ) {

        localStorage.setItem(
            "sesion",
            "activa"
        );

        document.getElementById("login")
            .style.display = "none";

    } else {

        document.getElementById(
            "errorLogin"
        ).innerText =
            "Usuario o contraseña incorrectos";
    }
}

// ======================
// REGISTRO
// ======================

function mostrarRegistro() {

    const nuevoUsuario =
        prompt("Nuevo usuario");

    if (!nuevoUsuario) return;

    const nuevaPass =
        prompt("Nueva contraseña");

    if (!nuevaPass) return;

    localStorage.setItem(
        "cuentaUsuario",
        nuevoUsuario
    );

    localStorage.setItem(
        "cuentaPass",
        nuevaPass
    );

    alert("Cuenta creada");
}

// ======================
// RECUPERAR
// ======================

function recuperarCuenta() {

    const usuario =
        prompt("Nuevo usuario");

    if (!usuario) return;

    const pass =
        prompt("Nueva contraseña");

    if (!pass) return;

    localStorage.setItem(
        "cuentaUsuario",
        usuario
    );

    localStorage.setItem(
        "cuentaPass",
        pass
    );

    alert("Cuenta actualizada");
}

// ======================
// CERRAR SESION
// ======================

function cerrarSesion() {

    localStorage.removeItem("sesion");

    location.reload();
}

// ======================
// SESION ACTIVA
// ======================

window.onload = function () {

    if (
        localStorage.getItem("sesion") ===
        "activa"
    ) {

        document.getElementById("login")
            .style.display = "none";
    }

    renderLibros();
};

// ======================
// CAMBIO DE PANTALLAS
// ======================

function mostrar(id) {

    const pantallas = [
        "inicio",
        "leer",
        "escribir"
    ];

    pantallas.forEach(nombre => {

        const elemento =
            document.getElementById(nombre);

        if (elemento) {
            elemento.classList.add("hidden");
        }
    });

    const pantalla =
        document.getElementById(id);

    if (pantalla) {
        pantalla.classList.remove("hidden");
    }
}

// ======================
// GUARDAR DATOS
// ======================

function guardarDatos() {

    localStorage.setItem(
        "libros",
        JSON.stringify(libros)
    );
}

// ======================
// RENDER VACIO
// ======================

function renderLibros() {

    const lista =
        document.getElementById("lista");

    const misLibros =
        document.getElementById("misLibros");

    if (!lista || !misLibros) return;

    lista.innerHTML = "";
    misLibros.innerHTML = "";
}
// ======================
// CREAR LIBRO
// ======================

function crearLibro() {

    const titulo =
        document.getElementById("tituloLibro").value;

    if (titulo.trim() === "") {

        alert("Escribe un título");

        return;
    }

    const checks =
        document.querySelectorAll(
            "#categorias input:checked"
        );

    const categorias =
        Array.from(checks).map(
            c => c.value
        );

    const archivo =
        document.getElementById("portada")
        .files[0];

    if (archivo) {

        const lector =
            new FileReader();

        lector.onload = function(e) {

            agregarLibro(
                titulo,
                e.target.result,
                categorias
            );
        };

        lector.readAsDataURL(
            archivo
        );

    } else {

        agregarLibro(
            titulo,
            "",
            categorias
        );
    }
}

// ======================
// AGREGAR LIBRO
// ======================

function agregarLibro(
    titulo,
    portada,
    categorias
) {

    libros.push({

        titulo: titulo,

        portada: portada,

        categorias: categorias,

        caps: [],

        comentarios: []

    });

    guardarDatos();

    renderLibros();

    document.getElementById(
        "tituloLibro"
    ).value = "";

    document.getElementById(
        "portada"
    ).value = "";

    document
        .querySelectorAll(
            "#categorias input"
        )
        .forEach(c => c.checked = false);

    alert("Libro creado");
}

// ======================
// MOSTRAR LIBROS
// ======================

function renderLibros() {

    const lista =
        document.getElementById("lista");

    const misLibros =
        document.getElementById(
            "misLibros"
        );

    if (!lista || !misLibros) return;

    lista.innerHTML = "";
    misLibros.innerHTML = "";

    libros.forEach((libro, i) => {

        lista.innerHTML += `

        <div class="card">

            ${
                libro.portada
                ?
                `<img src="${libro.portada}">`
                :
                ""
            }

            <h3>${libro.titulo}</h3>

            <p>
            ${(libro.categorias || []).join(" / ")}
            </p>

            <button onclick="leer(${i})">
                Leer
            </button>

        </div>
        `;

        misLibros.innerHTML += `

        <div class="card">

            <h4>${libro.titulo}</h4>

            <button onclick="abrirEditor(${i})">

                Editar libro

            </button>

            <button
                class="delete"
                onclick="borrarLibro(${i})">

                Borrar libro

            </button>

        </div>
        `;
    });
}

// ======================
// BORRAR LIBRO
// ======================

function borrarLibro(i) {

    if (
        confirm(
            "¿Eliminar este libro?"
        )
    ) {

        libros.splice(i, 1);

        guardarDatos();

        renderLibros();
    }
}

// ======================
// ABRIR EDITOR
// ======================

function abrirEditor(i) {

    libroActual = i;

    mostrar("escribir");

    document
        .getElementById("editor")
        .classList
        .remove("hidden");

    document
        .getElementById(
            "tituloEditor"
        )
        .innerText =
        libros[i].titulo;

    renderCapitulos();
}

// ======================
// LISTAR CAPITULOS
// ======================

function renderCapitulos() {

    const cont =
        document.getElementById(
            "caps"
        );

    if (
        libroActual === null
    ) return;

    cont.innerHTML = "";

    libros[
        libroActual
    ].caps.forEach((cap, i) => {

        cont.innerHTML += `

        <div class="card">

            <strong>
                ${cap.titulo}
            </strong>

            <button
                class="delete"
                onclick="borrarCapitulo(${i})">

                Eliminar

            </button>

        </div>
        `;
    });
}

// ======================
// BORRAR CAPITULO
// ======================

function borrarCapitulo(i) {

    libros[
        libroActual
    ].caps.splice(i, 1);

    guardarDatos();

    renderCapitulos();
}
// ======================
// CONTADOR PALABRAS
// ======================

function contarPalabras() {

    const texto =
        document.getElementById(
            "textoCap"
        ).value.trim();

    const cantidad =
        texto === ""
        ? 0
        : texto.split(/\s+/).length;

    document.getElementById(
        "contadorPalabras"
    ).innerText =
        cantidad + " palabras";
}

// ======================
// GUARDAR CAPITULO
// ======================

function guardarCap() {

    if (libroActual === null) return;

    const titulo =
        document.getElementById(
            "tituloCap"
        ).value;

    const texto =
        document.getElementById(
            "textoCap"
        ).value;

    if (titulo.trim() === "") {

        alert(
            "Escribe un título"
        );

        return;
    }

    const archivos =
        document.getElementById(
            "imgCap"
        ).files;

    if (archivos.length > 0) {

        let imagenes = [];
        let cargadas = 0;

        for (
            let i = 0;
            i < archivos.length;
            i++
        ) {

            const lector =
                new FileReader();

            lector.onload =
            function(e) {

                imagenes.push(
                    e.target.result
                );

                cargadas++;

                if (
                    cargadas ===
                    archivos.length
                ) {

                    agregarCapitulo(
                        titulo,
                        texto,
                        imagenes
                    );
                }
            };

            lector.readAsDataURL(
                archivos[i]
            );
        }

    } else {

        agregarCapitulo(
            titulo,
            texto,
            []
        );
    }
}

// ======================
// AGREGAR CAPITULO
// ======================

function agregarCapitulo(
    titulo,
    texto,
    imagenes
) {

    libros[
        libroActual
    ].caps.push({

        titulo,
        texto,
        img: imagenes

    });

    guardarDatos();

    renderCapitulos();

    document.getElementById(
        "tituloCap"
    ).value = "";

    document.getElementById(
        "textoCap"
    ).value = "";

    document.getElementById(
        "imgCap"
    ).value = "";

    contarPalabras();

    alert(
        "Capítulo guardado"
    );
}

// ======================
// LEER LIBRO
// ======================

function leer(i) {

    libroActual = i;

    mostrar("leer");

    const libro =
        libros[i];

    const cont =
        document.getElementById(
            "contenidoLibro"
        );

    cont.innerHTML = "";

    cont.innerHTML += `
        <h1>${libro.titulo}</h1>
    `;

    const esWebtoon =
        libro.categorias.includes("Anime")
        ||
        libro.categorias.includes("Manga")
        ||
        libro.categorias.includes("Comic");

    libro.caps.forEach(cap => {

        if (esWebtoon) {

            cont.innerHTML += `
                <h2>${cap.titulo}</h2>
            `;

            cap.img.forEach(img => {

                cont.innerHTML += `
                    <img src="${img}">
                `;
            });

        } else {

            cont.innerHTML += `

            <div class="card">

                <h3>
                ${cap.titulo}
                </h3>

                <p>
                ${cap.texto}
                </p>

            </div>

            `;
        }
    });

    mostrarComentarios();
}

// ======================
// COMENTARIOS
// ======================

function mostrarComentarios() {

    const libro =
        libros[libroActual];

    let html = `

    <div class="card">

        <h2>
        Comentarios
        </h2>

        <select id="estrellas">

            <option value="5">
            ⭐⭐⭐⭐⭐
            </option>

            <option value="4">
            ⭐⭐⭐⭐
            </option>

            <option value="3">
            ⭐⭐⭐
            </option>

            <option value="2">
            ⭐⭐
            </option>

            <option value="1">
            ⭐
            </option>

        </select>

        <textarea
        id="comentarioTexto"
        style="
        width:100%;
        margin-top:10px;
        min-height:80px;
        ">
        </textarea>

        <button
        onclick="agregarComentario()">

        Comentar

        </button>

    `;

    libro.comentarios.forEach(
        (c, i) => {

        html += `

        <div
        class="comentario-box">

            <strong>
            ${"⭐".repeat(
                c.estrellas
            )}
            </strong>

            <p>
            ${c.usuario}
            </p>

            <p>
            ${c.texto}
            </p>

            <button
            class="delete"
            onclick="
            borrarComentario(${i})
            ">

            Borrar

            </button>

        </div>

        `;
    });

    html += `</div>`;

    document.getElementById(
        "contenidoLibro"
    ).innerHTML += html;
}

// ======================
// AGREGAR COMENTARIO
// ======================

function agregarComentario() {

    const texto =
        document.getElementById(
            "comentarioTexto"
        ).value;

    const estrellas =
        parseInt(
            document.getElementById(
                "estrellas"
            ).value
        );

    if (
        texto.trim() === ""
    ) return;

    libros[
        libroActual
    ].comentarios.push({

        usuario:
        localStorage.getItem(
            "cuentaUsuario"
        ),

        texto,

        estrellas

    });

    guardarDatos();

    leer(libroActual);
}

// ======================
// BORRAR COMENTARIO
// ======================

function borrarComentario(i) {

    libros[
        libroActual
    ].comentarios.splice(
        i,
        1
    );

    guardarDatos();

    leer(libroActual);
}

// ======================
// BUSCAR LIBRO
// ======================

function buscarLibro() {

    const texto =
        document
        .getElementById(
            "busqueda"
        )
        .value
        .toLowerCase();

    const lista =
        document.getElementById(
            "lista"
        );

    lista.innerHTML = "";

    libros.forEach(
    (libro, i) => {

        if (
            libro.titulo
            .toLowerCase()
            .includes(texto)
        ) {

            lista.innerHTML += `

            <div class="card">

                ${
                    libro.portada
                    ?
                    `<img src="${libro.portada}">`
                    :
                    ""
                }

                <h3>
                ${libro.titulo}
                </h3>

                <button
                onclick="leer(${i})">

                Leer

                </button>

            </div>

            `;
        }
    });
}

// ======================
// FILTRAR
// ======================

function filtrar(cat) {

    if (
        cat === "Todos"
    ) {

        renderLibros();

        return;
    }

    const lista =
        document.getElementById(
            "lista"
        );

    lista.innerHTML = "";

    libros.forEach(
    (libro, i) => {

        if (
            libro.categorias
            .includes(cat)
        ) {

            lista.innerHTML += `

            <div class="card">

                <h3>
                ${libro.titulo}
                </h3>

                <button
                onclick="leer(${i})">

                Leer

                </button>

            </div>

            `;
        }
    });
}
/* ========================================= BIBLIOTECA VIRTUAL JAVASCRIPT BASE ========================================= */

/* ========================================= VARIABLES ========================================= */
let libros =
 JSON.parse(localStorage.getItem("libros" )) || [];
let libroActual = null;
/* =========================================
   SISTEMA DE USUARIOS
========================================= */

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuarioActual = localStorage.getItem("usuarioActual");

/* CREAR CUENTA */

document.getElementById("btnCrearCuenta").addEventListener("click", function() {

    const usuario = prompt("Elige un nombre de usuario:");

    if (!usuario) {
        return;
    }

    const contraseña = prompt("Elige una contraseña:");

    if (!contraseña) {
        return;
    }

    const usuarioExiste = usuarios.find(
        u => u.usuario === usuario
    );

    if (usuarioExiste) {
        alert("Ese usuario ya existe.");
        return;
    }

    usuarios.push({
        usuario: usuario,
        contraseña: contraseña
    });

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    alert("✅ Cuenta creada correctamente. Ahora puedes iniciar sesión.");
});


/* INICIAR SESIÓN */

document.getElementById("btnLogin").addEventListener("click", function() {

    const usuario = document
        .getElementById("usuarioLogin")
        .value
        .trim();

    const contraseña = document
        .getElementById("contraseñaLogin")
        .value;

    if (usuario === "" || contraseña === "") {
        alert("Escribe tu usuario y contraseña.");
        return;
    }

    const usuarioEncontrado = usuarios.find(
        u =>
            u.usuario === usuario &&
            u.contraseña === contraseña
    );

    if (!usuarioEncontrado) {
        alert("❌ Usuario o contraseña incorrectos.");
        return;
    }

    usuarioActual = usuarioEncontrado.usuario;

    localStorage.setItem(
        "usuarioActual",
        usuarioActual
    );

    alert("✅ Bienvenido, " + usuarioActual + " 📚");

    mostrarPantalla("inicio");
});

/* ========================================= CAMBIO DE PANTALLAS ========================================= */
function mostrarPantalla(id) {
const pantallas = document.querySelectorAll(".pantalla");

pantallas.forEach(pantalla => {
    pantalla.style.display = "none";
});

const pantalla = document.getElementById(id);

if (pantalla) {
    pantalla.style.display = "block";
}

}
function requiereLogin(){
    if (!usuarioActual){
        alert("primero debes iniciar sesion bro")
        mostrarPantalla("login");
        return false;
    }
    return true;
}

/* ========================================= BOTONES DE NAVEGACIÓN ========================================= */
document.getElementById("btnInicio").addEventListener("click", function() {
    if (!requiereLogin()) return;
mostrarPantalla("inicio");

});

document.getElementById("btnBiblioteca").addEventListener("click", function(){
    if (!requiereLogin())return;
    mostrarPantalla("biblioteca");
    mostrarLibros();
})

document.getElementById("btnCrear").addEventListener("click", function() {
if (!requiereLogin()) return;
mostrarPantalla("crear");

});

document.getElementById("btnCerrarSesion").addEventListener("click", function() {
    localStorage.removeItem("usuarioActual");
    usuarioActual = null;
    mostrarPantalla("login");
});

document.getElementById("irBiblioteca").addEventListener("click", function() {
    if (!requiereLogin()) return;
mostrarPantalla("biblioteca");

mostrarLibros();

});
document.getElementById("irCrear").addEventListener("click", function() {
    if (!requiereLogin()) return;

mostrarPantalla("crear");

});
document.getElementById("volverBiblioteca").addEventListener("click", function() {
mostrarPantalla("biblioteca");

mostrarLibros();

});
document.getElementById("volverMisLibros").addEventListener("click", function() {
mostrarPantalla("biblioteca");

mostrarLibros();

});
/* ========================================= CREAR LIBRO ========================================= */
document .getElementById("formularioLibro") .addEventListener("submit", function(event) {
   event.preventDefault();


    const titulo =
        document.getElementById("titulo").value.trim();


    const descripcion =
        document.getElementById("descripcion").value.trim();


    const portadaInput =
        document.getElementById("portada");


    const categoriasSeleccionadas =
        document.querySelectorAll(
            ".categorias input:checked"
        );


    const categorias =
        Array.from(categoriasSeleccionadas)
            .map(categoria => categoria.value);


    if (titulo === "") {

        alert("Escribe un título para el libro.");

        return;
    }


    /* =================================
       CREAR OBJETO DEL LIBRO
    ================================= */

    const nuevoLibro = {

        id: Date.now(),

        titulo: titulo,

        descripcion: descripcion,

        categorias: categorias,

        portada: null,

        capitulos: []

    };


    /* =================================
       PORTADA
    ================================= */

    if (portadaInput.files.length > 0) {

        const archivo = portadaInput.files[0];

        const lector = new FileReader();


        lector.onload = function(event) {

            nuevoLibro.portada =
                event.target.result;


            guardarLibro(nuevoLibro);

        };


        lector.readAsDataURL(archivo);

    } else {

        guardarLibro(nuevoLibro);

    }

});
/* ========================================= GUARDAR LIBRO ========================================= */
function guardarLibro(libro) {
libros.push(libro);

localStorage.setItem("libros",JSON.stringify(libros));

mostrarLibros();

document
    .getElementById("formularioLibro")
    .reset();


alert("📚 Libro creado correctamente");


mostrarPantalla("biblioteca");

}

/* ========================================= MOSTRAR LIBROS ========================================= */
function mostrarLibros() {

    const filtro = document.getElementById("filtroCategoria").value;
    const lista = document.getElementById("listaLibros");

    lista.innerHTML = "";

    const librosFiltrados = libros.filter(libro => {

        if (filtro === "Todos") {
            return true;
        }

        return Array.isArray(libro.categorias) &&
               libro.categorias.includes(filtro);
    });

    if (librosFiltrados.length === 0) {
        lista.innerHTML = `
            <p>
                No hay libros en esta categoría.
            </p>
        `;
        return;
    }

    librosFiltrados.forEach(libro => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "libro-card";

        let portadaHTML = "";

        if (libro.portada) {
            portadaHTML = `
                <img
                    src="${libro.portada}"
                    alt="${libro.titulo}"
                >
            `;
        }

        tarjeta.innerHTML = `

            ${portadaHTML}

            <h3>
                ${libro.titulo}
            </h3>

            <p>
                ${libro.descripcion || "Sin descripción"}
            </p>

            <p>
                ${
                    Array.isArray(libro.categorias) &&
                    libro.categorias.length > 0
                    ? libro.categorias.join(", ")
                    : "Sin categoría"
                }
            </p>

            <button onclick="abrirLibro(${libro.id})">
                📖 Leer libro
            </button>

            <button onclick="editarLibro(${libro.id})">
                ✍️ Editar
            </button>

            <button onclick="borrarLibro(${libro.id})">
                🗑️ Borrar
            </button>

        `;

        lista.appendChild(tarjeta);
    });
}


/* FILTRO DE CATEGORÍAS */

document.getElementById("filtroCategoria").addEventListener("change", function() {
    mostrarLibros();
});

/* ========================================= ABRIR LIBRO ========================================= */
function abrirLibro(id) {
const libro =
    libros.find(libro => libro.id === id);


if (!libro) {

    alert("No se encontró el libro.");

    return;
}


libroActual = libro;


const informacion =
    document.getElementById("informacionLibro");


informacion.innerHTML = `

    <h1>
        ${libro.titulo}
    </h1>

    <p>
        ${libro.descripcion || ""}
    </p>

    <p>
        ${
            libro.categorias.length > 0
            ? libro.categorias.join(", ")
            : ""
        }
    </p>

`;


mostrarCapitulos();


mostrarPantalla("lector");

}
/* ========================================= EDITAR LIBRO ========================================= */
function editarLibro(id) {
const libro =
    libros.find(libro => libro.id === id);


if (!libro) {

    alert("No se encontró el libro.");

    return;
}


libroActual = libro;


const datos =
    document.getElementById("datosLibro");


datos.innerHTML = `

    <h3>
        ${libro.titulo}
    </h3>

    <p>
        ${libro.descripcion || ""}
    </p>

    <p>
        Capítulos:
        ${libro.capitulos.length}
    </p>

`;


mostrarCapitulosEditor();


mostrarPantalla("editor");

}
/* ========================================= GUARDAR CAPÍTULO ========================================= */
document .getElementById("guardarCapitulo") .addEventListener("click", function() {
   if (!libroActual) {

        alert("Primero abre un libro.");

        return;
    }


    const titulo =
        document
            .getElementById("tituloCapitulo")
            .value
            .trim();


    const texto =
        document
            .getElementById("textoCapitulo")
            .value
            .trim();


    if (titulo === "") {

        alert("Escribe el título del capítulo.");

        return;
    }


    if (texto === "") {

        alert("Escribe el contenido del capítulo.");

        return;
    }


    const capitulo = {

        id: Date.now(),

        titulo: titulo,

        texto: texto

    };


    libroActual.capitulos.push(capitulo);
    localStorage.setItem("libros",JSON.stringify(libros));


    document
        .getElementById("tituloCapitulo")
        .value = "";


    document
        .getElementById("textoCapitulo")
        .value = "";


    mostrarCapitulosEditor();


    alert("📝 Capítulo guardado correctamente");

});
/* ========================================= MOSTRAR CAPÍTULOS EN EL EDITOR ========================================= */
function mostrarCapitulosEditor() {
const lista =
    document.getElementById("listaCapitulos");


lista.innerHTML = "";


if (!libroActual) {

    return;
}


if (libroActual.capitulos.length === 0) {

    lista.innerHTML = `
        <p>
            Este libro todavía no tiene capítulos.
        </p>
    `;

    return;
}


libroActual.capitulos.forEach((capitulo, indice) => {

    const elemento =
        document.createElement("div");


    elemento.innerHTML = `

        <h3>
            Capítulo ${indice + 1}: ${capitulo.titulo}
        </h3>

        <p>
            ${capitulo.texto.substring(0, 150)}
            ${capitulo.texto.length > 150 ? "..." : ""}
        </p>

    `;


    lista.appendChild(elemento);

});

}
/* ========================================= MOSTRAR CAPÍTULOS AL LEER ========================================= */
function mostrarCapitulos() {
const contenedor =
    document.getElementById("capitulos");


contenedor.innerHTML = "";


if (!libroActual) {

    return;
}


if (libroActual.capitulos.length === 0) {

    contenedor.innerHTML = `
        <p>
            Este libro todavía no tiene capítulos.
        </p>
    `;

    return;
}


libroActual.capitulos.forEach((capitulo, indice) => {

    const elemento =
        document.createElement("article");


    elemento.innerHTML = `

        <h2>
            Capítulo ${indice + 1}: ${capitulo.titulo}
        </h2>

        <p>
            ${capitulo.texto}
        </p>

    `;


    contenedor.appendChild(elemento);

});

}

/* ========================================= INICIO ========================================= */
if (usuarioActual) {
    mostrarPantalla("inicio");
} else {
    mostrarPantalla("login");
}
mostrarLibros();


function borrarLibro(id) {
    const confirmar = confirm(
        "seguro que quieres borrar el libro?"
    );
    if (!confirmar) {
        return;
    }
    libros = libros.filter(libro =>
        libro.id !== id);
        localStorage.setItem("libros",
            JSON.stringify(libros)
        );
        mostrarLibros();
        alert("libro borrado correctamente crack");
}
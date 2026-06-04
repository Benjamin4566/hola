let libros =
JSON.parse(localStorage.getItem("libros")) || [];

let actual = null;

let paginaActual = 0;

if(!localStorage.getItem("cuentaUsuario")){

    localStorage.setItem("cuentaUsuario","admin");

    localStorage.setItem("cuentaPass","1234");
}

function guardar(){

    localStorage.setItem(
        "libros",
        JSON.stringify(libros)
    );
}

function login(){

    let u =
    document.getElementById("user").value;

    let p =
    document.getElementById("pass").value;

    let usuario =
    localStorage.getItem("cuentaUsuario");

    let pass =
    localStorage.getItem("cuentaPass");

    if(u === usuario && p === pass){

        localStorage.setItem("sesion","activa");

        document.getElementById("login")
        .style.display = "none";

    }else{

        document.getElementById("errorLogin")
        .innerText = "Datos incorrectos";
    }
}

if(localStorage.getItem("sesion") === "activa"){

    document.getElementById("login")
    .style.display = "none";
}

function mostrarRegistro(){

    let nuevoUser = prompt("Nuevo usuario");

    if(!nuevoUser) return;

    let nuevaPass = prompt("Nueva contraseña");

    if(!nuevaPass) return;

    localStorage.setItem(
        "cuentaUsuario",
        nuevoUser
    );

    localStorage.setItem(
        "cuentaPass",
        nuevaPass
    );

    alert("Cuenta creada");
}

function recuperarCuenta(){

    let nuevoUser =
    prompt("Nuevo usuario");

    if(!nuevoUser) return;

    let nuevaPass =
    prompt("Nueva contraseña");

    if(!nuevaPass) return;

    localStorage.setItem(
        "cuentaUsuario",
        nuevoUser
    );

    localStorage.setItem(
        "cuentaPass",
        nuevaPass
    );

    alert("Cuenta recuperada");
}

function cerrarSesion(){

    localStorage.removeItem("sesion");

    location.reload();
}

function mostrar(s){

    ["inicio","leer","escribir"].forEach(x=>{

        document.getElementById(x)
        .classList.add("hidden");
    });

    document.getElementById(s)
    .classList.remove("hidden");
}

function crearLibro(){

    let t =
    document.getElementById("tituloLibro").value;

    if(t.trim() === ""){

        alert("Pon un título");

        return;
    }

    let checks =
    document.querySelectorAll(
        "#categorias input:checked"
    );

    let categorias =
    Array.from(checks).map(c => c.value);

    libros.push({
        titulo:t,
        caps:[],
        categorias,
        comentarios:[]
    });

    guardar();

    render();
}

function render(){

    let lista =
    document.getElementById("lista");

    lista.innerHTML = "";

    libros.forEach((l,i)=>{

        lista.innerHTML += `

        <div class="card">

        <h3>${l.titulo}</h3>

        <p>${l.categorias.join(" / ")}</p>

        <button onclick="leer(${i})">
        Leer
        </button>

        </div>
        `;
    });
}

function leer(i){

    actual = i;

    paginaActual = 0;

    mostrar("leer");

    renderLibro();
}

function renderLibro(){

    let cont =
    document.getElementById("contenidoLibro");

    let libro =
    libros[actual];

    let cats =
    libro.categorias || [];

    let esWebtoon =
        cats.includes("Anime") ||
        cats.includes("Manga") ||
        cats.includes("Comic");

    if(esWebtoon){

        cont.className =
        "lector webtoon";

        cont.innerHTML =
        `<h1>${libro.titulo}</h1>`;

        libro.caps.forEach(c=>{

            if(Array.isArray(c.img)){

                c.img.forEach(im=>{

                    cont.innerHTML +=
                    `<img src="${im}">`;
                });
            }
        });

        return;
    }

    let paginas = [];

    libro.caps.forEach(c=>{

        let palabras =
        c.texto.split(" ");

        for(let p = 0; p < palabras.length; p += 250){

            paginas.push({

                titulo:c.titulo,

                texto:
                palabras
                .slice(p,p+250)
                .join(" "),

                img:c.img
            });
        }
    });

    let izq =
    paginas[paginaActual];

    let der =
    paginas[paginaActual + 1];

    cont.innerHTML = `

    <h1>${libro.titulo}</h1>

    <div class="libro-real">

        <div class="pagina">

        ${
            izq
            ?
            `
            <h3>${izq.titulo}</h3>

            ${
                Array.isArray(izq.img)
                ?
                izq.img.map(im=>
                `<img src="${im}">`).join("")
                :
                ""
            }

            <p>${izq.texto}</p>

            <div class="pagina-num">
            ${paginaActual + 1}
            </div>
            `
            :
            ""
        }

        </div>

        <div class="pagina">

        ${
            der
            ?
            `
            <h3>${der.titulo}</h3>

            ${
                Array.isArray(der.img)
                ?
                der.img.map(im=>
                `<img src="${im}">`).join("")
                :
                ""
            }

            <p>${der.texto}</p>

            <div class="pagina-num">
            ${paginaActual + 2}
            </div>
            `
            :
            ""
        }

        </div>

    </div>

    <div class="controles-libro">

    <button onclick="anteriorPagina()">
    ⬅ Anterior
    </button>

    <button onclick="siguientePagina()">
    Siguiente ➡
    </button>

    </div>
    `;
}

function siguientePagina(){

    paginaActual += 2;

    renderLibro();
}

function anteriorPagina(){

    if(paginaActual >= 2){

        paginaActual -= 2;
    }

    renderLibro();
}

function guardarCap(){

    let t =
    document.getElementById("tituloCap").value;

    let txt =
    document.getElementById("textoCap").value;

    let files =
    document.getElementById("imgCap").files;

    let imgs = [];

    if(files.length > 0){

        let leidos = 0;

        for(let i=0;i<files.length;i++){

            let reader =
            new FileReader();

            reader.readAsDataURL(files[i]);

            reader.onload = ()=>{

                imgs.push(reader.result);

                leidos++;

                if(leidos === files.length){

                    agregarCap(t,txt,imgs);
                }
            };
        }

    }else{

        agregarCap(t,txt,[]);
    }
}

function agregarCap(t,txt,img){

    libros[actual].caps.push({

        titulo:t,
        texto:txt,
        img

    });

    guardar();

    alert("Capítulo guardado");

    document.getElementById("tituloCap").value = "";

    document.getElementById("textoCap").value = "";

    document.getElementById("imgCap").value = "";
}

render();
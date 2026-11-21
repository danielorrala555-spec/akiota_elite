
// VENTANA DE INICIO DE SESIÓN

const botonAdmin = document.querySelector('.admin-btn');
const ventanaAdmin = document.querySelector('#admin-login');
const cerrarAdmin = document.querySelector('#cerrar-admin');

// Abrir la ventana
botonAdmin.addEventListener('click', (evento) => {
    evento.preventDefault();
    ventanaAdmin.showModal();
});

// Cerrar la ventana
cerrarAdmin.addEventListener('click', () => {
    ventanaAdmin.close();
});

// Evitar que el formulario recargue la página
// coneccion con Supabase para iniciar sesión


 // INICIO DE SESIÓN CON SUPABASE

document.querySelector('#admin-form').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // Obtener los datos del formulario
    const correo = document.querySelector('#admin-email').value.trim();
    const contrasena = document.querySelector('#admin-password').value;

    // Comprobar las credenciales con Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: correo,
        password: contrasena
    });

    // Si las credenciales son incorrectas
    if (error) {
        document.querySelector('#admin-error').textContent =
            'No se pudo iniciar sesión. Revisa tu correo y contraseña.';
        console.error(error.message);
        return;
    }

    // Si las credenciales son correctas
    document.querySelector('#admin-error').textContent = '';

    console.log('Sesión iniciada:', data.user.id);

    ventanaAdmin.close();

    document.querySelector('#admin-panel').hidden = false;

});

function mostrarSeccion(seccion) {
    const mensaje = document.getElementById("admin-hint");

    // Ocultar todos los formularios
    document.querySelectorAll(
        "#portada-panel, #padres-panel, #contacto-panel, #cachorros-panel"
    ).forEach(panel => {
        panel.hidden = true;
    });

    // Mostrar solamente el formulario seleccionado
    const editor = document.getElementById(`${seccion}-panel`);

    if (editor) {
        editor.hidden = false;
        mensaje.textContent = `Estás editando: ${seccion}`;
        editor.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        mensaje.textContent = `La sección ${seccion} todavía no tiene formulario de edición.`;
    }
}

 // Navegación del menú lateral
document.querySelectorAll(".admin-menu-item").forEach(boton => {
    boton.addEventListener("click", () => {
        const seccion = boton.dataset.section;

        // Quitar el resaltado anterior
        document.querySelectorAll(".admin-menu-item")
            .forEach(item => {
                item.classList.remove("activo");
            });

        // Resaltar el botón seleccionado
        boton.classList.add("activo");

        // Mostrar el formulario correspondiente
        mostrarSeccion(seccion);

        // Cargar la fotografía actual de Portada
        if (seccion === "portada") {
            cargarImagenPortadaAdmin();
        }
    });
});


// Referencias para la sección Contacto
const botonContacto = document.querySelector('[data-section="contacto"]');


const whatsappContacto = document.getElementById("whatsapp-contacto");
const guardarContacto = document.getElementById("guardar-contacto");
const mensajeContacto = document.getElementById("mensaje-contacto");

// Cargar el número guardado en Supabase
async function cargarContacto() {
    const { data, error } = await supabaseClient
        .from("contacto")
        .select("whatsapp")
        .eq("id", 1)
        .single();

    if (error) {
        mensajeContacto.textContent = "Error al cargar el contacto.";
        console.error(error);
        return;
    }

    const numeroGuardado = String(data.whatsapp || "").replace(/\D/g, "");

whatsappContacto.value = numeroGuardado.startsWith("593")
    ? "0" + numeroGuardado.slice(3)
    : numeroGuardado;
}

// Guardar el número de WhatsApp
guardarContacto.addEventListener("click", async () => {
    
const numeroLocal = whatsappContacto.value.trim().replace(/\s/g, "");

if (!/^09\d{8}$/.test(numeroLocal)) {
    mensajeContacto.textContent =
        "Introduce un celular ecuatoriano válido de 10 dígitos, comenzando con 09.";
    return;
}

const numero = "+593" + numeroLocal.slice(1);


    guardarContacto.disabled = true;
    mensajeContacto.textContent = "Guardando contacto...";

    const { data, error } = await supabaseClient
        .from("contacto")
        .update({ whatsapp: numero })
        .eq("id", 1)
        .select("id");

    guardarContacto.disabled = false;

    if (error || !data || data.length === 0) {
        mensajeContacto.textContent = "No se pudo guardar el contacto.";
        if (error) console.error(error);
        return;
    }

    whatsappContacto.value = numeroLocal;
    mensajeContacto.textContent = "Contacto guardado correctamente.";
});

// Mostrar el número actual al abrir Contacto
botonContacto.addEventListener("click", cargarContacto);


const inputImagen = document.getElementById("imagen-portada");
const vistaImagen = document.getElementById("vista-imagen-portada");
const botonGuardar = document.getElementById("guardar-portada");
const mensajePortada = document.getElementById("mensaje-portada");

async function cargarImagenPortadaAdmin() {
    const { data, error } = await supabaseClient
        .from("portada")
        .select("imagen_url")
        .eq("id", 1)
        .single();

    if (error) {
        console.error("Error al cargar la portada:", error);
        mensajePortada.textContent =
            "No se pudo cargar la imagen de portada.";
        return;
    }

    // No reemplazar una imagen nueva que el usuario ya eligió
    if (inputImagen.files.length > 0) return;

    if (data.imagen_url) {
        vistaImagen.src = data.imagen_url;
        vistaImagen.style.display = "block";
    } else {
        vistaImagen.removeAttribute("src");
        vistaImagen.style.display = "none";
    }
}


let urlVistaPrevia = null;

// REFERENCIAS DEL PANEL DE PADRES

const seleccionarPadre = document.getElementById("seleccionar-padre");
const nombrePadre = document.getElementById("nombre-padre");
const razaPadre = document.getElementById("raza-padre");
const rolPadre = document.getElementById("rol-padre");
const informacionPadre = document.getElementById("informacion-padre");
const imagenPadre = document.getElementById("imagen-padre");
const vistaImagenPadre = document.getElementById("vista-imagen-padre");
const guardarPadre = document.getElementById("guardar-padre");
const mensajePadre = document.getElementById("mensaje-padre");

inputImagen.addEventListener("change", () => {
    const archivo = inputImagen.files[0];

    if (urlVistaPrevia) {
        URL.revokeObjectURL(urlVistaPrevia);
        urlVistaPrevia = null;
    }

    if (!archivo) {
        vistaImagen.style.display = "none";
        vistaImagen.removeAttribute("src");
        return;
    }

    if (!archivo.type.startsWith("image/")) {
        mensajePortada.textContent = "Selecciona una imagen válida.";
        inputImagen.value = "";
        return;
    }

    if (archivo.size > 10 * 1024 * 1024) {
        mensajePortada.textContent = "La imagen no puede superar 10 MB.";
        inputImagen.value = "";
        return;
    }

    urlVistaPrevia = URL.createObjectURL(archivo);
    vistaImagen.src = urlVistaPrevia;
    vistaImagen.style.display = "block";
    mensajePortada.textContent = "";
});



botonGuardar.addEventListener("click", async () => {
    const titulo = document.getElementById("titulo-portada").value.trim();
    const subtitulo = document.getElementById("subtitulo-portada").value.trim();
    const archivo = inputImagen.files[0];

    botonGuardar.disabled = true;
    mensajePortada.textContent = "Guardando cambios...";

    try {
        const cambios = {};

if (titulo) {
    cambios.titulo = titulo;
}

if (subtitulo) {
    cambios.subtitulo = subtitulo;
}
        const { data: portadaAnterior, error: errorConsulta } = await supabaseClient
    .from("portada")
    .select("imagen_url")
    .eq("id", 1)
    .single();

if (errorConsulta) {
    throw errorConsulta;
}

        if (archivo) {
            const extension = archivo.name.split(".").pop().toLowerCase();
            const nombreArchivo = `portada-${crypto.randomUUID()}.${extension}`;

            const { error: errorSubida } = await supabaseClient.storage
                .from("akita-imagenes")
                .upload(nombreArchivo, archivo, {
                    contentType: archivo.type
                });

            if (errorSubida) {
                throw errorSubida;
            }

            const { data: imagenPublica } = supabaseClient.storage
                .from("akita-imagenes")
                .getPublicUrl(nombreArchivo);

            cambios.imagen_url = imagenPublica.publicUrl;
        }

        const { data, error } = await supabaseClient
            .from("portada")
            .update(cambios)
            .eq("id", 1)
            .select();

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            throw new Error("No se actualizó la portada. Revisa los permisos y el ID.");
        }
        
        if (archivo && portadaAnterior.imagen_url) {
    const urlAnterior = portadaAnterior.imagen_url;

    const { data: bucketData } = supabaseClient.storage
        .from("akita-imagenes")
        .getPublicUrl("");

    const prefijo = bucketData.publicUrl.replace(/\/?$/, "/");

    if (urlAnterior.startsWith(prefijo)) {
        const rutaArchivo = decodeURIComponent(
            urlAnterior.slice(prefijo.length).split("?")[0]
        );

        if (rutaArchivo) {
            const { error: errorEliminacion } = await supabaseClient.storage
                .from("akita-imagenes")
                .remove([rutaArchivo]);

            if (errorEliminacion) {
                console.warn(
                    "No se pudo eliminar la imagen anterior:",
                    errorEliminacion
                );
            }
        }
    }
}

        mensajePortada.textContent = "Cambios guardados correctamente.";

    } catch (error) {
        console.error("Error al guardar portada:", error);
        mensajePortada.textContent = "Error al guardar los cambios.";
    } finally {
        botonGuardar.disabled = false;
    }
});

async function cargarPadresAdmin() {
    const { data, error } = await supabaseClient
        .from("padres")
        .select("id, nombre, raza, rol, informacion_adicional, imagen_url")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error al cargar los padres:", error);
        mensajePadre.textContent = "No se pudieron cargar los padres.";
        return;
    }

    seleccionarPadre.innerHTML =
        '<option value="">Selecciona un ejemplar</option>';

    data.forEach(padre => {
        const opcion = document.createElement("option");
        opcion.value = padre.id;
        opcion.textContent = padre.nombre;
        seleccionarPadre.appendChild(opcion);
    });
}

cargarPadresAdmin();

seleccionarPadre.addEventListener("change", async () => {
    const idPadre = seleccionarPadre.value;

    // Limpiar los campos al cambiar de ejemplar
    nombrePadre.value = "";
    razaPadre.value = "";
    rolPadre.value = "Padre";
    informacionPadre.value = "";
    imagenPadre.value = "";
    vistaImagenPadre.removeAttribute("src");
    vistaImagenPadre.style.display = "none";
    mensajePadre.textContent = "";

    if (!idPadre) return;

    // Consultar los datos del ejemplar en Supabase
    const { data, error } = await supabaseClient
        .from("padres")
        .select("id, nombre, raza, rol, informacion_adicional, imagen_url")
        .eq("id", idPadre)
        .single();

    if (error) {
        console.error("Error al cargar el ejemplar:", error);
        mensajePadre.textContent = "Error al cargar los datos.";
        return;
    }

    // Evitar mostrar datos si el usuario cambió de selección
    if (seleccionarPadre.value !== String(data.id)) return;

    // Rellenar los campos
    nombrePadre.value = data.nombre || "";
    razaPadre.value = data.raza || "";
    rolPadre.value = data.rol || "Padre";
    informacionPadre.value = data.informacion_adicional || "";

    // Mostrar la fotografía guardada en Supabase
    if (data.imagen_url) {
        vistaImagenPadre.src = data.imagen_url;
        vistaImagenPadre.style.display = "block";
    }
});


guardarPadre.addEventListener("click", async () => {
    const idPadre = seleccionarPadre.value;

    if (!idPadre) {
        mensajePadre.textContent = "Selecciona un ejemplar.";
        return;
    }

    const nombre = nombrePadre.value.trim();
    const raza = razaPadre.value.trim();
    const rol = rolPadre.value;
    const informacion = informacionPadre.value.trim();
    const archivo = imagenPadre.files[0];

    if (!nombre || !raza) {
        mensajePadre.textContent = "Nombre y raza son obligatorios.";
        return;
    }

    guardarPadre.disabled = true;
    mensajePadre.textContent = "Guardando cambios...";

    let rutaNueva = null;
    let imagenGuardada = false;

    try {
        // Consultar la fotografía actual.
        const { data: anterior, error: errorConsulta } =
            await supabaseClient
                .from("padres")
                .select("imagen_url")
                .eq("id", idPadre)
                .single();

        if (errorConsulta) throw errorConsulta;

        const cambios = {
            nombre,
            raza,
            rol,
            informacion_adicional: informacion
        };

        if (archivo) {
            mensajePadre.textContent = "Comprimiendo fotografía...";

            const comprimida = await comprimirImagenPadre(archivo);

            rutaNueva = `padres/${idPadre}/${crypto.randomUUID()}.webp`;

            mensajePadre.textContent = "Subiendo fotografía...";

            const { error: errorSubida } = await supabaseClient
                .storage
                .from("akita-imagenes")
                .upload(rutaNueva, comprimida, {
                    contentType: "image/webp",
                    upsert: false
                });

            if (errorSubida) throw errorSubida;

            const { data: urlData } = supabaseClient
                .storage
                .from("akita-imagenes")
                .getPublicUrl(rutaNueva);

            cambios.imagen_url = urlData.publicUrl;
        }

        // Actualizar la información del ejemplar.
        const { data, error } = await supabaseClient
            .from("padres")
            .update(cambios)
            .eq("id", idPadre)
            .select("id, nombre, imagen_url");

        if (error) throw error;

        if (!data || data.length !== 1) {
            throw new Error("No se pudo actualizar el ejemplar.");
        }

        imagenGuardada = true;

        seleccionarPadre.selectedOptions[0].textContent =
            data[0].nombre;

        // Eliminar la fotografía anterior de Storage.
        if (archivo && anterior.imagen_url) {
            const urlAnterior = anterior.imagen_url;
            const marcador = "/akita-imagenes/";
            const posicion = urlAnterior.indexOf(marcador);

            if (posicion !== -1) {
                const rutaAnterior = decodeURIComponent(
                    urlAnterior.substring(posicion + marcador.length)
                        .split("?")[0]
                );

                if (rutaAnterior.startsWith(`padres/${idPadre}/`)
                    && rutaAnterior !== rutaNueva) {

                    const { error: errorBorrado } =
                        await supabaseClient.storage
                            .from("akita-imagenes")
                            .remove([rutaAnterior]);

                    if (errorBorrado) {
                        console.warn(
                            "No se eliminó la fotografía anterior:",
                            errorBorrado
                        );
                    }
                }
            }
        }

        imagenPadre.value = "";
        mensajePadre.textContent =
            "Cambios guardados correctamente.";

    } catch (error) {
        console.error("Error al guardar:", error);

        // Limpiar una subida nueva si no se guardó en la tabla.
        if (rutaNueva && !imagenGuardada) {
            const { error: errorLimpieza } =
                await supabaseClient.storage
                    .from("akita-imagenes")
                    .remove([rutaNueva]);

            if (errorLimpieza) {
                console.warn("No se pudo limpiar la subida:", errorLimpieza);
            }
        }

        mensajePadre.textContent =
            "No se pudieron guardar los cambios.";
    } finally {
        guardarPadre.disabled = false;
    }
});


async function comprimirImagenPadre(archivo) {
    const LIMITE = 10 * 1024 * 1024;

    if (archivo.size > LIMITE) {
        throw new Error("La imagen no puede superar los 10 MB.");
    }

    if (!archivo.type.startsWith("image/")) {
        throw new Error("Selecciona una imagen válida.");
    }

    const imagen = await createImageBitmap(archivo);

    try {
        const escala = Math.min(
            1,
            1600 / Math.max(imagen.width, imagen.height)
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(imagen.width * escala);
        canvas.height = Math.round(imagen.height * escala);

        const contexto = canvas.getContext("2d");

        if (!contexto) {
            throw new Error("No se pudo procesar la imagen.");
        }

        contexto.drawImage(
            imagen,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                resultado => {
                    if (resultado) resolve(resultado);
                    else reject(new Error("Error al comprimir."));
                },
                "image/webp",
                0.8
            );
        });

        if (blob.type !== "image/webp") {
            throw new Error("No se pudo generar WebP.");
        }

        return blob;
    } finally {
        imagen.close();
    }
}

let urlVistaPadre = null;

imagenPadre.addEventListener("change", () => {
    const archivo = imagenPadre.files[0];

    if (urlVistaPadre) {
        URL.revokeObjectURL(urlVistaPadre);
        urlVistaPadre = null;
    }

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
        mensajePadre.textContent = "Selecciona una imagen válida.";
        imagenPadre.value = "";
        return;
    }

    if (archivo.size > 10 * 1024 * 1024) {
        mensajePadre.textContent = "La imagen no puede superar 10 MB.";
        imagenPadre.value = "";
        return;
    }

    urlVistaPadre = URL.createObjectURL(archivo);

    vistaImagenPadre.src = urlVistaPadre;
    vistaImagenPadre.style.display = "block";


    mensajePadre.textContent = "";
});

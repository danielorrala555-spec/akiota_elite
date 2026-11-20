
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

function portada() {
    const mensaje = document.getElementById("admin-hint");
    mensaje.textContent = "Estás editando: Portada";

    const editor = document.getElementById("portada-panel");
    editor.hidden = false;
}
const botonPortada = document.querySelector('[data-section="portada"]');
botonPortada.addEventListener("click", portada);
  

function Padres() {
    const mensaje = document.getElementById("admin-hint");
    mensaje.textContent = "Estás editando: Padres";

    const editor = document.getElementById("padres-panel");
    editor.hidden = false;
}
const botonPadres = document.querySelector('[data-section="padres"]');
botonPadres.addEventListener("click", Padres);


function Cachorros() {
    const mensaje = document.getElementById("admin-hint");
    mensaje.textContent = "Estás editando: Cachorros";

    const editor = document.getElementById("cachorros-panel");
    editor.hidden = false;
  }
const botonCachorros = document.querySelector('[data-section="cachorros"]');
botonCachorros.addEventListener("click", Cachorros);


function Camadas() {
    const mensaje = document.getElementById("admin-hint");
    mensaje.textContent = "Estás editando: Camadas";

    const editor = document.getElementById("camadas-panel");
    editor.hidden = false;
}
const botonCamadas = document.querySelector('[data-section="camadas"]');
botonCamadas.addEventListener("click", Camadas);

const inputImagen = document.getElementById("imagen-portada");
const vistaImagen = document.getElementById("vista-imagen-portada");
const botonGuardar = document.getElementById("guardar-portada");
const mensajePortada = document.getElementById("mensaje-portada");

let urlVistaPrevia = null;

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

    if (!titulo || !subtitulo) {
        mensajePortada.textContent = "Completa el título y subtítulo.";
        return;
    }

    botonGuardar.disabled = true;
    mensajePortada.textContent = "Guardando cambios...";

    try {
        const cambios = { titulo, subtitulo };

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

        mensajePortada.textContent = "Cambios guardados correctamente.";

    } catch (error) {
        console.error("Error al guardar portada:", error);
        mensajePortada.textContent = "Error al guardar los cambios.";
    } finally {
        botonGuardar.disabled = false;
    }
});

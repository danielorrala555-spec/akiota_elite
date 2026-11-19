
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
}
const botonPortada = document.querySelector('[data-section="portada"]');
botonPortada.addEventListener("click", portada);
  

function Padres() {
    const mensaje = document.getElementById("admin-hint");
    mensaje.textContent = "Estás editando: Padres";
}
const botonPadres = document.querySelector('[data-section="padres"]');
botonPadres.addEventListener("click", Padres);


function Cachorros() {
    const mensaje = document.getElementById("admin-hint");
    mensaje.textContent = "Estás editando: Cachorros";
}
const botonCachorros = document.querySelector('[data-section="cachorros"]');
botonCachorros.addEventListener("click", Cachorros);


function Camadas() {
    const mensaje = document.getElementById("admin-hint");
    mensaje.textContent = "Estás editando: Camadas";
}
const botonCamadas = document.querySelector('[data-section="camadas"]');
botonCamadas.addEventListener("click", Camadas);

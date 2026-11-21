const cachorros = [
  {
    id: 1,
    nombre: 'Akira',
    sexo: 'Macho',
    edad: '2 meses',
    color: 'Blanco y marrón',
    padres: 'Koda y Nala',
    disponible: true,
    fotoPrincipal: 'IMG/akira-1.png',
    galeria: [
        'IMG/akira-2.png',
        'IMG/akira-3.png'
    ]
},
  {
    id: 2,
    nombre: 'Yuki',
    sexo: 'Hembra',
    edad: '3 meses',
    color: 'Blanco y negro',
    padres: 'Koda y Nala',
    disponible: true,
    fotoPrincipal: 'IMG/yuki-1.png',
    galeria: [
        'IMG/yuki-2.png',
        'IMG/yuki-3.png'
    ]
  },
  {
    id: 3,
    nombre: 'Kuma',
    sexo: 'Macho',
    edad: '2 meses',
    color: 'Marrón y blanco',
    padres: 'Koda y Nala',
    disponible: false,
    fotoPrincipal: 'IMG/kuma-1.png',
    galeria: [
        'IMG/kuma-2.png',
        'IMG/kuma-3.png'
    ]
  }
];


const fotosPadres = {
    Padre: 'IMG/koda-1.jpg',
    Madre: 'IMG/nala-1.png'
};

const grid = document.querySelector('#puppy-grid');
const parentGrid = document.querySelector('#parent-grid');
const escapar = valor => String(valor).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
grid.innerHTML = cachorros.map(c => `
  <article class="puppy">
    
<div class="photo">
  ${c.fotoPrincipal
    ? `<img src="${escapar(c.fotoPrincipal)}" alt="Fotografía de ${escapar(c.nombre)}">`
    : `Foto de ${escapar(c.nombre)} (pendiente)`
  }
</div>

    <div class="content">
      <div class="topline"><h3>${escapar(c.nombre)}</h3><span class="status">${c.disponible?'● Disponible':'● No disponible'}</span></div>
      <p class="meta">${escapar(c.sexo)} · ${escapar(c.edad)}</p>
      <button class="toggle" type="button" aria-expanded="false" aria-controls="detalles-${c.id}">Ver más</button>
      <div class="details" id="detalles-${c.id}" hidden>
        <p><strong>Raza:</strong> Akita americano</p>
        <p><strong>Color:</strong> ${escapar(c.color)}</p>
        <p><strong>Padres:</strong> ${escapar(c.padres)}</p>
        <p><strong>Salud y pedigrí:</strong> Información pendiente de confirmar con el criadero.</p>
<div class="thumbs">
    ${c.galeria?.length
        ? c.galeria.map(src => `
            <img
                class="thumb-img"
                src="${escapar(src)}"
                alt="Foto adicional de ${escapar(c.nombre)}"
            >
        `).join('')
        : '<p>Sin fotografías adicionales.</p>'
    }
</div>

        
<p><strong>Código:</strong> AK-${String(c.id).padStart(3, '0')}</p>

${c.disponible ? `
  <button
    type="button"
    class="whatsapp-demo"
    data-puppy-id="${c.id}">
    ☎ Consultar por WhatsApp
  </button>
` : ''}

      </div>
    </div>
  </article>`).join('');



async function cargarPadres() {
  const { data, error } = await supabaseClient
    .from("padres")
    .select("id, nombre, raza, rol, informacion_adicional, imagen_url")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al cargar los padres:", error);
  }

  // Conservamos los datos locales si falla la consulta.
  const listaPadres = !error && data?.length
    ? data
    : padres.map((p, i) => ({
        id: i + 1,
        nombre: p.nombre,
        raza: "Akita americano",
        rol: p.rol,
        informacion_adicional: null,
        imagen_url: null
      }));

  parentGrid.innerHTML = listaPadres.map((p, i) => {
    const fotoLocal = p.rol === "Madre"
      ? "IMG/nala-1.png"
      : "IMG/koda-1.jpg";

    const foto = p.imagen_url || fotoLocal;

    return `
      <article class="parent">
        <div class="photo">
          <img
            src="${escapar(foto)}"
            alt="Fotografía de ${escapar(p.nombre)}"
          >
        </div>

        <div class="content">
          <div class="topline">
            <h3>${escapar(p.nombre)}</h3>
            <span class="meta">${escapar(p.rol)}</span>
          </div>

          <button
            class="toggle"
            type="button"
            aria-expanded="false"
            aria-controls="padre-detalles-${i}"
          >
            Ver información
          </button>

          <div class="details" id="padre-detalles-${i}" hidden>
            <p><strong>Nombre:</strong> ${escapar(p.nombre)}</p>
            <p><strong>Raza:</strong> ${escapar(p.raza)}</p>
            <p><strong>Rol:</strong> ${escapar(p.rol)}</p>
            <!------------------ MOSTRAR INFORMACIÓN ADICIONAL SI EXISTE, O "..." SI NO ------------------>
            <p>${escapar(p.informacion_adicional || "...")}</p>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

cargarPadres();



const botones = document;
const duracion = 400;

function animarDetalles(boton, abrir) {
    const detalles = boton.nextElementSibling;

    // Cancela una animación anterior si existe
    detalles.getAnimations().forEach(a => a.cancel());

    const alturaInicial = detalles.hidden
        ? 0
        : detalles.getBoundingClientRect().height;

    if (abrir) {
        detalles.hidden = false;
    }

    const alturaFinal = abrir ? detalles.scrollHeight : 0;

    detalles.style.overflow = 'hidden';
    detalles.style.height = `${alturaInicial}px`;

    const animacion = detalles.animate(
        [
            {
                height: `${alturaInicial}px`,
                opacity: abrir ? 0 : 1
            },
            {
                height: `${alturaFinal}px`,
                opacity: abrir ? 1 : 0
            }
        ],
        {
            duration: duracion,
            easing: 'ease-in-out'
        }
    );

    boton.setAttribute('aria-expanded', String(abrir));

    boton.textContent = abrir
        ? 'Ocultar información'
        : boton.closest('.parent')
            ? 'Ver información'
            : 'Ver más';

    animacion.onfinish = () => {
        detalles.hidden = !abrir;
        detalles.style.height = '';
        detalles.style.overflow = '';
    };
}

document.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".toggle");
    if (!boton) return;

    const abrir = boton.getAttribute("aria-expanded") !== "true";
    animarDetalles(boton, abrir);
});

grid.addEventListener("click", async (evento) => {
    const boton = evento.target.closest(".whatsapp-demo");
    if (!boton) return;

    const cachorro = cachorros.find(
        c => String(c.id) === boton.dataset.puppyId
    );

    if (!cachorro || !cachorro.disponible) return;

    const codigo = `AK-${String(cachorro.id).padStart(3, "0")}`;

    const mensaje =
        `Hola, estoy interesado en el cachorro ${cachorro.nombre}, ` +
        `código ${codigo}, de raza Akita americano. ` +
        `Me gustaría conocer su precio y obtener más información.`;

    // Consultar el WhatsApp guardado en Supabase
    const { data, error } = await supabaseClient
        .from("contacto")
        .select("whatsapp")
        .eq("id", 1)
        .single();

    if (error || !data?.whatsapp) {
        console.error("Error al consultar WhatsApp:", error);
        alert("El número de WhatsApp no está disponible.");
        return;
    }

    const numero = data.whatsapp.replace(/\D/g, "");

    const enlace = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(enlace, "_blank", "noopener,noreferrer");
});

// -------------- Cargar la portada desde Supabase y actualizar el contenido de la página -------------//

async function cargarPortada() {
    const { data, error } = await supabaseClient
        .from("portada")
        .select("titulo, subtitulo, imagen_url")
        .eq("id", 1)
        .single();

    if (error) {
        console.error("Error al cargar la portada:", error);
        return;
    }

    const titulo = document.getElementById("hero-titulo");
    const subtitulo = document.getElementById("hero-subtitulo");
    const hero = document.querySelector(".hero");

    if (titulo && data.titulo !== null) {
        titulo.textContent = data.titulo;
    }

    if (subtitulo && data.subtitulo !== null) {
        subtitulo.textContent = data.subtitulo;
    }

    if (hero && data.imagen_url) {
        hero.style.backgroundImage = `
            linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.153),
                rgba(0, 0, 0, 0.25)
            ),
            url("${encodeURI(data.imagen_url).replace(/"/g, "%22")}")
        `;
    }
}

cargarPortada();

// Cargar WhatsApp de la sección Contacto

async function cargarWhatsAppPublico() {
    const enlace = document.getElementById("contacto-whatsapp");
    const aviso = document.getElementById("contacto-aviso");

    if (!enlace || !aviso) return;

    try {
        const { data, error } = await supabaseClient
            .from("contacto")
            .select("whatsapp")
            .eq("id", 1)
            .single();

        if (error) throw error;

        const whatsapp = String(data?.whatsapp || "").trim();
        const numero = whatsapp.replace(/\D/g, "");

        if (!numero) {
            enlace.hidden = true;
            aviso.hidden = false;
            aviso.textContent = "Contacto no disponible por el momento.";
            return;
        }

        const mensaje = "Hola, me gustaría obtener información sobre los cachorros de Akita Elite.";

        enlace.href = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        enlace.hidden = false;

        // Mostrar el número debajo del botón
        aviso.textContent = `WhatsApp: ${whatsapp}`;
        aviso.hidden = false;

    } catch (error) {
        console.error("Error al cargar contacto:", error);
        enlace.hidden = true;
        aviso.hidden = false;
        aviso.textContent = "No se pudo cargar el contacto.";
    }
}

cargarWhatsAppPublico();

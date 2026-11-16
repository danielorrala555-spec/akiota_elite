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

const padres = [
  {
    nombre: 'Koda',
    rol: 'Padre',
    foto: 'IMG/koda-1.jpg'
  },
  {
    nombre: 'Nala',
    rol: 'Madre',
    foto: 'IMG/nala-1.png'
  }
];
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


parentGrid.innerHTML = padres.map((p, i) => `
  <article class="parent">
    <div class="photo">
      <img
        src="${escapar(p.foto)}"
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
        <p><strong>Raza:</strong> Akita americano</p>
        <p><strong>Rol:</strong> ${escapar(p.rol)}</p>
        <p>Información adicional pendiente de confirmar.</p>
      </div>
    </div>
  </article>
`).join('');


const botones = document.querySelectorAll('.toggle');
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

botones.forEach(boton => {
    boton.addEventListener('click', () => {
        const detalles = boton.nextElementSibling;
        const abrir = boton.getAttribute('aria-expanded') !== 'true';

        // Cerrar las otras tarjetas abiertas
        botones.forEach(otroBoton => {
            if (
                otroBoton !== boton &&
                otroBoton.getAttribute('aria-expanded') === 'true'
            ) {
                animarDetalles(otroBoton, false);
            }
        });

        animarDetalles(boton, abrir);
    });
});

const ventanaWhatsApp = document.querySelector('#whatsapp-preview');
const mensajeWhatsApp = document.querySelector('#whatsapp-message');

grid.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.whatsapp-demo');
    if (!boton) return;

    const cachorro = cachorros.find(
        c => String(c.id) === boton.dataset.puppyId
    );

    if (!cachorro || !cachorro.disponible) return;

    const codigo = `AK-${String(cachorro.id).padStart(3, '0')}`;

    mensajeWhatsApp.textContent =
        `Hola, estoy interesado en el cachorro ${cachorro.nombre}, ` +
        `código ${codigo}, de raza Akita americano. ` +
        `Me gustaría conocer su precio y obtener más información.`;

    ventanaWhatsApp.showModal();
});

document.querySelector('#cerrar-whatsapp').addEventListener('click', () => {
    ventanaWhatsApp.close();
});


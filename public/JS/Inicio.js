document.addEventListener('DOMContentLoaded', function() {
    const iconGrid = document.getElementById('iconGrid');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const showLessBtn = document.getElementById('showLessBtn');
    const icons = [
        '/public/IMG/E_SDG_Icons_NoText-01.jpg',
        '/public/IMG/E_SDG_Icons_NoText-02.jpg',
        '/public/IMG/E_SDG_Icons_NoText-03_0.jpg',
        '/public/IMG/E_SDG_Icons_NoText-04.jpg',
        '/public/IMG/E_SDG_Icons_NoText-05.jpg',
        '/public/IMG/E_SDG_Icons_NoText-06.jpg',
        '/public/IMG/E_SDG_Icons_NoText-07.jpg',
        '/public/IMG/E_SDG_Icons_NoText-08.jpg',
        '/public/IMG/E_SDG_Icons_NoText-09.jpg',
        '/public/IMG/E_SDG_Icons_NoText-10.jpg',
        '/public/IMG/E_SDG_Icons_NoText-11.jpg',
        '/public/IMG/E_SDG_Icons_NoText-12.jpg',
        '/public/IMG/E_SDG_Icons_NoText-13.jpg',
        '/public/IMG/E_SDG_Icons_NoText-14.jpg',
        '/public/IMG/E_SDG_Icons_NoText-15.jpg',
        '/public/IMG/E_SDG_Icons_NoText-16.jpg',
        '/public/IMG/E_SDG_Icons_NoText-17.jpg'
    ];

    let visibleIcons = [];
    let hiddenIcons = [...icons];
    let iconsPerPage = window.innerWidth <= 768 ? 4 : icons.length; // Muestra todos los íconos si no es responsivo

    function createIconElement(src) {
        const div = document.createElement('div');
        div.className = 'icon';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'SDG Icon';
        div.appendChild(img);
        return div;
    }

    function showIcons(count) {
        for (let i = 0; i < count && hiddenIcons.length > 0; i++) {
            const icon = hiddenIcons.shift();
            visibleIcons.push(icon);
            iconGrid.appendChild(createIconElement(icon));
        }
        updateButtonVisibility();
    }

    function hideIcons(count) {
        for (let i = 0; i < count && visibleIcons.length > iconsPerPage; i++) {
            const icon = visibleIcons.pop();
            hiddenIcons.unshift(icon);
            iconGrid.removeChild(iconGrid.lastChild);
        }
        updateButtonVisibility();
    }

    function updateButtonVisibility() {
        showMoreBtn.style.display = hiddenIcons.length > 0 ? 'inline-block' : 'none';
        showLessBtn.classList.toggle('d-none', visibleIcons.length <= iconsPerPage);
    }

    function adjustIconDisplay() {
        const newIconsPerPage = window.innerWidth <= 768 ? 4 : icons.length; // Muestra todos los íconos si no es responsivo
        if (newIconsPerPage !== iconsPerPage) {
            // Reset the display
            hiddenIcons = [...icons];
            visibleIcons = [];
            iconGrid.innerHTML = '';
            showIcons(newIconsPerPage);
            iconsPerPage = newIconsPerPage; // Actualiza el número de íconos por página
        }
    }

    showMoreBtn.addEventListener('click', function() {
        showIcons(iconsPerPage);
    });

    showLessBtn.addEventListener('click', function() {
        hideIcons(visibleIcons.length - iconsPerPage);
    });

    // Initial display
    showIcons(iconsPerPage);

    // Adjust display on window resize
    window.addEventListener('resize', adjustIconDisplay);
});




//Navbar
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            menu.classList.add('show');
        });

        dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            menu.classList.remove('show');
        });
    });
});




// Mostrar el botón cuando el usuario se desplaza hacia abajo 100px
window.onscroll = function() { showButtonOnScroll() };

function showButtonOnScroll() {
    const button = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

// Función para desplazarse suavemente hacia arriba
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const content = document.getElementById("content");

    setTimeout(() => {
        loadingScreen.style.display = "none"; // Oculta la pantalla de carga
        content.style.display = "block"; // Muestra el contenido de la página
    }, 2000); // 3000 ms de retraso para coincidir con el tiempo de la animación
});

// Archivo JS del cliente (Inicio.js)
fetch('/api/evento')  // Realiza la solicitud para obtener el evento
  .then(response => response.json())
  .then(data => {
    if (data) {
      const fecha = new Date(data.fecha);  // Convierte la fecha a un objeto Date
      console.log('Fecha recibida:', fecha);

      // Verifica si la fecha es válida
      if (isNaN(fecha.getTime())) {
        // Si la fecha es inválida
        document.getElementById('evento').innerText = '¡No te pierdas el evento el Fecha inválida!';
      } else {
        // Muestra la fecha en formato local
        document.getElementById('evento').innerText = `¡No te pierdas el evento el ${fecha.toLocaleDateString()}!`;
      }
    } else {
      // Si no hay evento
      document.getElementById('evento').innerText = '¡No hay eventos programados!';
    }
  })
  .catch(error => console.error('Error al obtener el evento:', error));


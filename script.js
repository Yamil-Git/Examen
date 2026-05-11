let listaIds = [];
let currentIndex = 0;

// 1. Carga la lista de IDs
async function cargarSlider() {
    try {
        const res = await fetch('slider.php');

        if (!res.ok) {
            throw new Error("No se pudo conectar con slider.php");
        }

        listaIds = await res.json();

        if (!listaIds || listaIds.length === 0) {
            document.getElementById('slider').innerHTML = "<p>No hay imágenes</p>";
            return;
        }

        const contenedor = document.getElementById('slider');

        // Estructura del slider
        contenedor.innerHTML = `
            <div id="slide-container" style="width:100%; height:100%;"></div>

            <button class="absolute top-1/2 left-5 -translate-y-1/2 bg-black/40 p-4 rounded-full z-50 text-white" onclick="prevSlide()">
                <i class="fas fa-chevron-left"></i>
            </button>

            <button class="absolute top-1/2 right-5 -translate-y-1/2 bg-black/40 p-4 rounded-full z-50 text-white" onclick="nextSlide()">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        currentIndex = 0;
        mostrarImagen(listaIds[currentIndex].id);

    } catch (error) {
        console.error("Error al cargar IDs:", error);
        document.getElementById('slider').innerHTML = "<p>Error al cargar imágenes</p>";
    }
}

// 2. Mostrar imagen
function mostrarImagen(id) {
    $.ajax({
        url: `generar_visor.php?id=${id}&t=${new Date().getTime()}`,
        cache: false,

        success: function(result) {
            $('#slide-container').html(result);
        },

        error: function(xhr, status, error) {
            console.error("Error AJAX:", error);
            $('#slide-container').html('<p>Error al cargar la imagen</p>');
        }
    });
}

// 3. Flecha siguiente
function nextSlide() {
    if (listaIds.length === 0) return;

    currentIndex = (currentIndex + 1) % listaIds.length;
    mostrarImagen(listaIds[currentIndex].id);
}

// 4. Flecha anterior
function prevSlide() {
    if (listaIds.length === 0) return;

    currentIndex = (currentIndex - 1 + listaIds.length) % listaIds.length;
    mostrarImagen(listaIds[currentIndex].id);
}

// 5. Al cargar página
document.addEventListener("DOMContentLoaded", function() {
    cargarSlider();

    const botonSubir = document.querySelector(".btn-magenta");

    if (botonSubir) {
        // Evita doble ejecución
        botonSubir.removeAttribute("onclick");

        botonSubir.addEventListener("click", function() {
            subirImagen();
        });
    }
});

// 6. Eliminar imagen
async function eliminarImagen(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('id', id);

        const res = await fetch('delete.php', {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            throw new Error("Error en delete.php");
        }

        const resultado = await res.text();

        if (resultado.includes("correctamente")) {
            alert(resultado);
            cargarSlider();

        } else {
            alert("Hubo un problema: " + resultado);
        }

    } catch (error) {
        console.error("Error en borrado:", error);
        alert("No se pudo eliminar.");
    }
}

// 7. Subir imagen
function subirImagen() {
    const fileInput = document.getElementById('fileInput');

    if (!fileInput) {
        alert("No se encontró el input.");
        return;
    }

    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecciona una imagen primero.");
        return;
    }

    const formatosPermitidos = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    if (!formatosPermitidos.includes(file.type)) {
        alert("Formato no permitido. Usa JPG, PNG, GIF o WebP.");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert("La imagen supera el máximo permitido de 5MB.");
        return;
    }

    const formData = new FormData();
    formData.append('imagen', file);

    fetch('upload.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en el servidor');
        }

        return response.text();
    })
    .then(data => {
        console.log("Respuesta servidor:", data);

        if (data.trim() === "OK") {
            alert("¡Imagen subida correctamente!");

            fileInput.value = "";

            // Recargar slider sin duplicar
            cargarSlider();

        } else {
            alert("El servidor dice: " + data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error al conectar: " + error.message);
    });
}

// 8. Sidebar responsive
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    if (window.innerWidth <= 768) {
        sidebar.classList.toggle("active");
    } else {
        sidebar.classList.toggle("hidden");
    }
}

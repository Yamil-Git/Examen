let listaIds = [];
let currentIndex = 0;

// 1. Carga la lista de IDs (Esto ya confirmaste que funciona)
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

        // Preparamos el HTML básico del slider
        contenedor.innerHTML = `
            <div id="slide-container" style="width:100%; height:100%;"></div>
            <div class="slider-controls">
                <button class="arrow" onclick="prevSlide()">❮</button>
                <button class="arrow" onclick="nextSlide()">❯</button>
            </div>
        `;

        // Mostramos la primera imagen de la lista
        currentIndex = 0;
        mostrarImagen(listaIds[currentIndex].id);

    } catch (error) {
        console.error("Error al cargar IDs:", error);
        document.getElementById('slider').innerHTML = "<p>Error al cargar imágenes</p>";
    }
}

// 2. Función clave: Usa la URL directa que te funcionó en el navegador
function mostrarImagen(id) {
    console.log("Cambiando imagen al ID: " + id);

    $.ajax({
        // Llamamos a generar_visor.php y evitamos caché
        url: `generar_visor.php?id=${id}&t=${new Date().getTime()}`,
        cache: false,

        success: function(result) {
            // Insertamos el resultado HTML en el contenedor
            $('#slide-container').html(result);
        },

        error: function(xhr, status, error) {
            console.error("Error AJAX:", error);
            $('#slide-container').html('<p>Error al cargar el componente de imagen</p>');
        }
    });
}

// 3. Funciones de las flechas
function nextSlide() {
    if (listaIds.length === 0) return;

    currentIndex = (currentIndex + 1) % listaIds.length;
    mostrarImagen(listaIds[currentIndex].id);
}

function prevSlide() {
    if (listaIds.length === 0) return;

    currentIndex = (currentIndex - 1 + listaIds.length) % listaIds.length;
    mostrarImagen(listaIds[currentIndex].id);
}

// 4. Iniciar cuando cargue el DOM
document.addEventListener("DOMContentLoaded", function() {
    cargarSlider();

    // Vincular botón de subir imagen
    const botonSubir = document.querySelector(".btn-magenta");

    if (botonSubir) {
        botonSubir.addEventListener("click", subirImagen);
    }
});

// 5. Función eliminar
async function eliminarImagen(id) {
    // 1. Preguntar al usuario para evitar borrar por error
    if (!confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
        return;
    }

    try {
        // 2. Enviar el ID mediante una petición POST (AJAX)
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

        // 3. Si se eliminó correctamente en la DB, actualizamos la vista
        if (resultado.includes("correctamente")) {
            alert(resultado);

            // Refrescamos slider
            cargarSlider();

        } else {
            alert("Hubo un problema: " + resultado);
        }

    } catch (error) {
        console.error("Error en la petición de borrado:", error);
        alert("No se pudo conectar con el servidor para eliminar.");
    }
}

// 6. Subir imagen
function subirImagen() {

    // IMPORTANTE:
    // Tu HTML original usa id="fileInput"
    const fileInput = document.getElementById('fileInput');

    if (!fileInput) {
        alert("No se encontró el input de archivo.");
        return;
    }

    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecciona una imagen primero.");
        return;
    }

    // Validar formatos
    const formatosPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!formatosPermitidos.includes(file.type)) {
        alert("Formato no permitido. Usa JPG, PNG, GIF o WebP.");
        return;
    }

    // Validar tamaño máximo 5MB
    if (file.size > 5 * 1024 * 1024) {
        alert("La imagen supera el máximo permitido de 5MB.");
        return;
    }

    const formData = new FormData();

    // Debe coincidir con $_FILES['imagen']
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

            // Limpiar input
            fileInput.value = "";

            // Refrescar slider
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

// 7. Sidebar responsive
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    // Si la pantalla es pequeña (menor a 768px)
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle("active");

    } else {
        // En PC sigue funcionando como antes
        sidebar.classList.toggle("hidden");
    }
}

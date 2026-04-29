let listaIds = []; 
let currentIndex = 0;

// 1. Carga la lista de IDs (Esto ya confirmaste que funciona)
async function cargarSlider() {
    try {
        const res = await fetch('slider.php');
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
        mostrarImagen(listaIds[currentIndex].id);

    } catch (error) {
        console.error("Error al cargar IDs:", error);
    }
}

// 2. Función clave: Usa la URL directa que te funcionó en el navegador
function mostrarImagen(id) {
    // Alert opcional como en el ejemplo del docente
    console.log("Cambiando imagen al ID: " + id);

    $.ajax({
        // Llamamos a un script que nos devuelva el HTML de la imagen
        url: `generar_visor.php?id=${id}`, 
        cache: false,
        success: function(result) {
            // Insertamos el resultado (el HTML) en el contenedor
            $('#slide-container').html(result);
        },
        error: function() {
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
document.addEventListener("DOMContentLoaded", cargarSlider);

// 5. fiuncion eliminar
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

        const resultado = await res.text();

        // 3. Si se eliminó correctamente en la DB, actualizamos la vista
        if (resultado.includes("correctamente")) {
            alert(resultado);
            
            // Volvemos a llamar a cargarSlider para que la lista de IDs se actualice
            // y la imagen borrada ya no aparezca
            cargarSlider(); 
        } else {
            alert("Hubo un problema: " + resultado);
        }

    } catch (error) {
        console.error("Error en la petición de borrado:", error);
        alert("No se pudo conectar con el servidor para eliminar.");
    }
}

// 6. subir img
function subirImagen() {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecciona una imagen primero.");
        return;
    }

    const formData = new FormData();
    
    // AQUÍ ESTABA EL ERROR: 
    // Debe ser 'imagen' para que coincida con $_FILES['imagen'] de tu PHP
    formData.append('imagen', file); 

    fetch('upload.php', { 
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en el servidor');
        return response.text();
    })
    .then(data => {
        console.log("Respuesta servidor:", data);
        if (data.trim() === "OK") { // Tu PHP devuelve "OK" si todo sale bien
            alert("¡Imagen subida correctamente!");
            cargarSlider(); // Refresca el slider sin recargar la página
        } else {
            alert("El servidor dice: " + data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error al conectar: " + error.message);
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    
    // Si la pantalla es pequeña (menor a 768px)
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle("active"); // Usamos la clase active para mostrar/ocultar
    } else {
        // En PC sigue funcionando como antes (colapsando)
        sidebar.classList.toggle("hidden");
    }
}

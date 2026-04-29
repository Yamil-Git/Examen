<?php
// generar_visor.php
$id = $_GET['id'] ?? 0;

// Aquí generamos el HTML exacto que se insertará en el slider
// La URL de la imagen sigue siendo tu get_image.php
echo '
    <img src="get_image.php?id=' . $id . '" 
         style="width:100%; height:100%; object-fit:cover; display:block;">
    
    <button class="btn-delete" onclick="eliminarImagen(' . $id . ')" 
            style="position:absolute; bottom:20px; right:20px; z-index:100;">
        ✕
    </button>
';
?>

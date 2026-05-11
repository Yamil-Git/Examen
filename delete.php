<?php
// 1. Corregimos el nombre del archivo y la escritura de require
require_once 'dbmysql.php';

if (isset($_POST['id'])) {
    $id = $_POST['id'];

    try {
        $db = conectarMySQL();
        
        // AJUSTE: Cambiamos la tabla 'slider' por 'imagenes'
        $sql = "DELETE FROM imagenes WHERE id = :id";
        
        $stmt = $db->prepare($sql);
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() > 0) {
            echo "Imagen eliminada correctamente";
        } else {
            echo "No se encontró ninguna imagen con ese ID";
        }
    } catch (Exception $e) {
        echo "Error al eliminar: " . $e->getMessage();
    }
} else {
    echo "ID no recibido";
}
?>

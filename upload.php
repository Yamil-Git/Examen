<?php
// 1. Forzar a PHP a mostrar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 2. Usar un bloque try-catch global para capturar errores de carga de archivos
try {
    if (!file_exists('db_pgsql.php')) {
        throw new Exception("Error: No se encuentra el archivo db_pgsql.php");
    }
    
    require_once 'db_pgsql.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_FILES['imagen'])) {
            $nombre = $_FILES['imagen']['name'];
            $tipo   = $_FILES['imagen']['type'];
            $tmp    = $_FILES['imagen']['tmp_name'];

            if (!is_uploaded_file($tmp)) {
                throw new Exception("Error: El archivo no se cargó correctamente en el servidor.");
            }

            $imagen = file_get_contents($tmp);
            $db = conectarDB(); // Asegúrate que esta función exista en db_pgsql.php

            $sql = "INSERT INTO slider (nombre, tipo, imagen) VALUES (:nombre, :tipo, :imagen)";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':tipo', $tipo);
            $stmt->bindParam(':imagen', $imagen, PDO::PARAM_LOB);

            if ($stmt->execute()) {
                echo "OK";
            } else {
                echo "Error en ejecución de SQL";
            }
        } else {
            echo "No se recibió archivo (isset imagen falló)";
        }
    } else {
        echo "Método no permitido";
    }
} catch (Exception $e) {
    // ESTO es lo que verás en el alert
    echo "ERROR FATAL: " . $e->getMessage();
}

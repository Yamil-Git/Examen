<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    if (!file_exists('dbmysql.php')) {
        throw new Exception("Error: No se encuentra el archivo dbmysql.php");
    }
    
    require_once 'dbmysql.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_FILES['imagen'])) {
            $nombre    = $_FILES['imagen']['name'];
            $extension = $_FILES['imagen']['type']; // El MIME type (image/jpeg, etc)
            $tmp       = $_FILES['imagen']['tmp_name'];

            if (!is_uploaded_file($tmp)) {
                throw new Exception("Error: El archivo no se cargó correctamente.");
            }

            $datos = file_get_contents($tmp);
            $db = conectarDB(); 

            // AJUSTE: Tabla 'imagenes' y columnas 'nombre', 'datos', 'extension'
            $sql = "INSERT INTO imagenes (nombre, datos, extension) VALUES (:nombre, :datos, :extension)";
            
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':extension', $extension);
            // Para BLOB en MySQL con PDO se usa PARAM_LOB
            $stmt->bindParam(':datos', $datos, PDO::PARAM_LOB);

            if ($stmt->execute()) {
                echo "OK";
            } else {
                // Esto te dirá exactamente qué falló en el SQL
                $errorInfo = $stmt->errorInfo();
                echo "Error SQL: " . $errorInfo[2];
            }
        } else {
            echo "No se recibió archivo 'imagen'";
        }
    }
} catch (Exception $e) {
    echo "ERROR FATAL: " . $e->getMessage();
}

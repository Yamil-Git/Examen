<?php
require_once 'db_pgsql.php';

if (isset($_GET['id'])) {
    try {
        $db = conectarDB();
        $stmt = $db->prepare("SELECT tipo, imagen FROM slider WHERE id = :id");
        $stmt->execute(['id' => $_GET['id']]);
        
        // Usamos fetch normal para manejar mejor el buffer
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $imagen = $row['imagen'];
            $tipo = trim($row['tipo']);

            // Si es un recurso (LOB), lo leemos
            if (is_resource($imagen)) {
                $imagen = stream_get_contents($imagen);
            }

            // Limpieza de caracteres de escape de PostgreSQL si existen
            if (strpos($imagen, '\\x') === 0) {
                $imagen = pack('H*', substr($imagen, 2));
            }

            if (ob_get_length()) ob_clean();
            
            header("Content-Type: " . $tipo);
            header("Content-Length: " . strlen($imagen)); // Ayuda al navegador a saber cuánto leer
            echo $imagen;
            exit;
        }
    } catch (Exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
        echo $e->getMessage();
    }
}

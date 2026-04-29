<?php
function conectarDB() {
    $host = "localhost";
    $db   = "ymedina_db";
    $user = "ymedina";
    $pass = "12345678";

    try {
        $conexion = new PDO("pgsql:host=$host;dbname=$db", $user, $pass);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // ESTA LÍNEA ES CLAVE: Fuerza a Postgres a no enviar basura extra
        $conexion->exec("SET bytea_output = 'escape'"); 
        
        return $conexion;
    } catch (PDOException $e) {
        die("Error de conexión: " . $e->getMessage());
    }
}
?>

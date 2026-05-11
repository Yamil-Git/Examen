<?php

function conectarMySQL() {
    $host = "localhost";
    $dbname = "slider_db";
    $usuario = "ymedina";
    $password = "123456789";

    try {
        $conexion = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $usuario,
            $password
        );

        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $conexion;

    } catch (PDOException $e) {
        die("Error de conexión: " . $e->getMessage());
    }
}

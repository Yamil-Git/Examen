<?php
$host = "localhost";
$user = "ymedina";
$pass = "123456789";
$db   = "slider_db";

// Conexión para MySQL
$conexion = mysqli_connect($host, $user, $pass, $db);

if (!$conexion) {
    die("Error de conexión a MySQL: " . mysqli_connect_error());
}
?>

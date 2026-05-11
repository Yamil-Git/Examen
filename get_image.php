<?php
// get_image.php CORREGIDO PARA MYSQL

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'dbmysql.php';

try {
    // Verificar ID
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        throw new Exception("ID inválido");
    }

    $id = intval($_GET['id']);

    // Conexión correcta
    $db = conectarMySQL();

    // Buscar imagen
    $sql = "SELECT datos, extension FROM imagenes WHERE id = :id LIMIT 1";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $imagen = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$imagen) {
        throw new Exception("Imagen no encontrada");
    }

    // Tipo MIME correcto
    header("Content-Type: " . $imagen['extension']);

    // Mostrar imagen binaria
    echo $imagen['datos'];

} catch (Exception $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}

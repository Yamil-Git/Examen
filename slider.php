<?php
require_once 'dbmysql.php';
header('Content-Type: application/json');

try {
    $db = conectarMySQL();
    // Solo pedimos los IDs para que la carga inicial sea instantánea
    $sql = "SELECT id FROM imagenes ORDER BY id DESC";
    $stmt = $db->query($sql);
    $ids = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($ids);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

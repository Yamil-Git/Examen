<?php
require_once 'db_pgsql.php';
header('Content-Type: application/json');

try {
    $db = conectarDB();
    // Solo pedimos los IDs para que la carga inicial sea instantánea
    $sql = "SELECT id FROM slider ORDER BY id DESC";
    $stmt = $db->query($sql);
    $ids = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($ids);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

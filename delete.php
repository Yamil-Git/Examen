<?php
require_once 'db_pgsql.php';

if (isset($_POST['id'])) {
    $id = $_POST['id'];

    try {
        $db = conectarDB();
        $sql = "DELETE FROM slider WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute(['id' => $id]);

        echo "Imagen eliminada correctamente";
    } catch (Exception $e) {
        echo "Error al eliminar: " . $e->getMessage();
    }
} else {
    echo "ID no recibido";
}
?>

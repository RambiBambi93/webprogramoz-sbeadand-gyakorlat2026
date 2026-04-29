<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Az OPTIONS kérés kezelése (a böngésző először ezt küldi el ellenőrzésként)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include 'db.php';

$adat = isset($_GET['adat']) ? $_GET['adat'] : '';

// --- 1. ADATOK LEKÉRÉSE (GET) ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($adat == 'filmek') {
        $sql = "SELECT * FROM filmek";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    } 
    elseif ($adat == 'mozik') {
        $sql = "SELECT * FROM mozik";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    }
    elseif ($adat == 'helyek') {
        $sql = "SELECT * FROM helyek";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    }
}

// --- 2. ÜZENET MENTÉSE (POST) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $adat == 'uzenet_kuldes') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input) {
        $nev = $conn->real_escape_string($input['nev']);
        $email = $conn->real_escape_string($input['email']);
        $uzenet = $conn->real_escape_string($input['uzenet']);

        $sql = "INSERT INTO uzenetek (nev, email, uzenet) VALUES ('$nev', '$email', '$uzenet')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Üzenet elmentve!"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
    }
}

// --- 3. FILM TÖRLÉSE (DELETE) ---
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id > 0) {
        // Fontos: Előbb a kapcsolótáblából (helyek) is törölni kellene a referenciát, 
        // de ha a tábla létrehozásakor nem volt ON DELETE CASCADE, akkor manuálisan kell:
        $conn->query("DELETE FROM helyek WHERE fkod = $id");
        
        $sql = "DELETE FROM filmek WHERE fkod = $id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Film törölve!"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
    }
}

$conn->close();
?>
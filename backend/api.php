<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
    // ÜZENETEK LEKÉRÉSE (Fordított időrend: a legfrissebb van elöl)
    elseif ($adat == 'uzenetek') {
        $sql = "SELECT * FROM uzenetek ORDER BY datum DESC";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    }
    // KÉPEK LEKÉRÉSE
    elseif ($adat == 'kepek') {
        $sql = "SELECT * FROM kepek ORDER BY feltoltve DESC";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    }
    elseif ($adat == 'mozik' || $adat == 'helyek') {
        $sql = "SELECT * FROM $adat";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    }
}

// --- 2. ADATOK MENTÉSE ÉS KÉPFELTÖLTÉS (POST) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // KÉPFELTÖLTÉS KEZELÉSE (Ez a rész FormData-t fogad, nem sima JSON-t)
    if (isset($_GET['adat']) && $_GET['adat'] == 'kep_feltoltes') {
        if (isset($_FILES['kep'])) {
            $fajlnev = time() . '_' . basename($_FILES['kep']['name']);
            $cel_mappa = "uploads/" . $fajlnev;
            
            if (!is_dir('uploads')) { mkdir('uploads'); } // Ha nincs mappa, létrehozza
            
            if (move_uploaded_file($_FILES['kep']['tmp_name'], $cel_mappa)) {
                $sql = "INSERT INTO kepek (fajlnev) VALUES ('$fajlnev')";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(["status" => "success", "message" => "Kép feltöltve!"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Adatbázis hiba."]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Hiba a fájl mozgatásakor."]);
            }
        }
        exit;
    }

    // TÖBBI JSON ADAT FELDOLGOZÁSA (CRUD, Login, Üzenet)
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {
        if ($adat == 'uzenet_kuldes') {
            $nev = $conn->real_escape_string($input['nev']);
            $email = $conn->real_escape_string($input['email']);
            $uzenet = $conn->real_escape_string($input['uzenet']);

            $sql = "INSERT INTO uzenetek (nev, email, uzenet) VALUES ('$nev', '$email', '$uzenet')";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error"]);
            }
        }
        elseif ($adat == 'uj_film') {
            $cim = $conn->real_escape_string($input['filmcim']);
            $mufaj = $conn->real_escape_string($input['mufaj']);
            $hossz = intval($input['hossz']);
            
            $sql = "INSERT INTO filmek (filmcim, mufaj, hossz) VALUES ('$cim', '$mufaj', $hossz)";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error"]);
            }
        }
        elseif ($adat == 'szerkeszt_film') {
            $id = intval($input['fkod']);
            $cim = $conn->real_escape_string($input['filmcim']);
            $mufaj = $conn->real_escape_string($input['mufaj']);
            $hossz = intval($input['hossz']);
            
            $sql = "UPDATE filmek SET filmcim='$cim', mufaj='$mufaj', hossz=$hossz WHERE fkod=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error"]);
            }
        }
        elseif ($adat == 'login') {
            $fnev = $conn->real_escape_string($input['username']);
            $pw = $conn->real_escape_string($input['password']);
            
            $sql = "SELECT teljes_nev FROM felhasznalok WHERE felhasznalonev='$fnev' AND jelszo='$pw'";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                echo json_encode(["status" => "success", "user" => $user['teljes_nev']]);
            } else {
                echo json_encode(["status" => "error", "message" => "Hibás adatok!"]);
            }
        }
    }
}

// --- 3. FILM TÖRLÉSE (DELETE) ---
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        $conn->query("DELETE FROM helyek WHERE fkod = $id");
        $sql = "DELETE FROM filmek WHERE fkod = $id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error"]);
        }
    }
}

$conn->close();
?>
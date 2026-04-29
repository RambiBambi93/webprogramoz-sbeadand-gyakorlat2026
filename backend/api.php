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

// --- 2. ADATOK MENTÉSE, MÓDOSÍTÁSA ÉS BEJELENTKEZÉS (POST) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input) {
        // --- ÜZENET KÜLDÉSE ---
        if ($adat == 'uzenet_kuldes') {
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
        // --- ÚJ FILM HOZZÁADÁSA ---
        elseif ($adat == 'uj_film') {
            $cim = $conn->real_escape_string($input['filmcim']);
            $mufaj = $conn->real_escape_string($input['mufaj']);
            $hossz = intval($input['hossz']);

            $sql = "INSERT INTO filmek (filmcim, mufaj, hossz) VALUES ('$cim', '$mufaj', $hossz)";
            
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["status" => "success", "message" => "Film hozzáadva!", "id" => $conn->insert_id]);
            } else {
                echo json_encode(["status" => "error", "message" => $conn->error]);
            }
        }
        // --- FILM SZERKESZTÉSE (UPDATE) ---
        elseif ($adat == 'szerkeszt_film') {
            $id = intval($input['fkod']);
            $cim = $conn->real_escape_string($input['filmcim']);
            $mufaj = $conn->real_escape_string($input['mufaj']);
            $hossz = intval($input['hossz']);

            $sql = "UPDATE filmek SET filmcim='$cim', mufaj='$mufaj', hossz=$hossz WHERE fkod=$id";
            
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["status" => "success", "message" => "Film frissítve!"]);
            } else {
                echo json_encode(["status" => "error", "message" => $conn->error]);
            }
        }
        // --- BEJELENTKEZÉS (Ezt adtuk hozzá) ---
        elseif ($adat == 'login') {
            $fnev = $conn->real_escape_string($input['username']);
            $pw = $conn->real_escape_string($input['password']);

            // Megnézzük, van-e ilyen felhasználó ezzel a jelszóval
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
            echo json_encode(["status" => "success", "message" => "Film törölve!"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
    }
}

$conn->close();
?>
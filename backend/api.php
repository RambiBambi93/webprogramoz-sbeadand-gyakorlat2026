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
    // ... (A meglévő GET ágaid változatlanok maradhatnak)
    if ($adat == 'filmek') {
        $sql = "SELECT * FROM filmek";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    } elseif ($adat == 'uzenetek') {
        $sql = "SELECT * FROM uzenetek ORDER BY datum DESC";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    } elseif ($adat == 'kepek') {
        $sql = "SELECT * FROM kepek ORDER BY feltoltve DESC";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    } elseif ($adat == 'mozik' || $adat == 'helyek') {
        $sql = "SELECT * FROM $adat";
        $result = $conn->query($sql);
        $lista = [];
        while($row = $result->fetch_assoc()) { $lista[] = $row; }
        echo json_encode($lista);
    }
}

// --- 2. ADATOK MENTÉSE (POST) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Képfeltöltés (FormData)
    if (isset($_GET['adat']) && $_GET['adat'] == 'kep_feltoltes') {
        // ... (A meglévő képfeltöltő kódod változatlan)
        if (isset($_FILES['kep'])) {
            $fajlnev = time() . '_' . basename($_FILES['kep']['name']);
            $cel_mappa = "uploads/" . $fajlnev;
            if (!is_dir('uploads')) { mkdir('uploads'); }
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

    // JSON adatok (Regisztráció, Login, Üzenet, Filmek)
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {

        // --- ÚJ: REGISZTRÁCIÓ ---
        if ($adat == 'regisztracio') {
            $vnev = $conn->real_escape_string($input['vezeteknev']);
            $knev = $conn->real_escape_string($input['keresztnev']);
            $fnev = $conn->real_escape_string($input['username']);
            $pw = $conn->real_escape_string($input['password']);

            // Ellenőrizzük, létezik-e már a név
            $check = $conn->query("SELECT id FROM felhasznalok WHERE felhasznalonev='$fnev'");
            if ($check->num_rows > 0) {
                echo json_encode(["status" => "error", "message" => "Ez a felhasználónév már foglalt!"]);
            } else {
                $sql = "INSERT INTO felhasznalok (vezeteknev, keresztnev, felhasznalonev, jelszo) VALUES ('$vnev', '$knev', '$fnev', '$pw')";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(["status" => "success", "message" => "Sikeres regisztráció! Most már bejelentkezhetsz."]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Hiba a mentéskor."]);
                }
            }
        }

        // --- MÓDOSÍTOTT: LOGIN (visszaadja a neveket a fejléchez) ---
        elseif ($adat == 'login') {
            $fnev = $conn->real_escape_string($input['username']);
            $pw = $conn->real_escape_string($input['password']);
            
            // Lekérjük a vezetéknevet és keresztnevet is
            $sql = "SELECT vezeteknev, keresztnev, felhasznalonev FROM felhasznalok WHERE felhasznalonev='$fnev' AND jelszo='$pw'";
            $result = $conn->query($sql);
            
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                // Egy objektumot küldünk vissza, amiben minden benne van a fejléchez
                echo json_encode([
                    "status" => "success", 
                    "user" => [
                        "vezeteknev" => $user['vezeteknev'],
                        "keresztnev" => $user['keresztnev'],
                        "felhasznalonev" => $user['felhasznalonev']
                    ]
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => "Hibás felhasználónév vagy jelszó!"]);
            }
        }

        // --- Üzenet küldése (Változatlan) ---
        elseif ($adat == 'uzenet_kuldes') {
            $nev = $conn->real_escape_string($input['nev']);
            $email = $conn->real_escape_string($input['email']);
            $uzenet = $conn->real_escape_string($input['uzenet']);
            $sql = "INSERT INTO uzenetek (nev, email, uzenet) VALUES ('$nev', '$email', '$uzenet')";
            echo json_encode(["status" => ($conn->query($sql) === TRUE ? "success" : "error")]);
        }
        
        // ... (A többi film kezelő kódod: uj_film, szerkeszt_film változatlan maradhat)
        elseif ($adat == 'uj_film') {
            $cim = $conn->real_escape_string($input['filmcim']);
            $mufaj = $conn->real_escape_string($input['mufaj']);
            $hossz = intval($input['hossz']);
            $sql = "INSERT INTO filmek (filmcim, mufaj, hossz) VALUES ('$cim', '$mufaj', $hossz)";
            echo json_encode(["status" => ($conn->query($sql) === TRUE ? "success" : "error")]);
        }
    }
}

// --- 3. TÖRLÉS (Változatlan) ---
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        $conn->query("DELETE FROM helyek WHERE fkod = $id");
        $sql = "DELETE FROM filmek WHERE fkod = $id";
        echo json_encode(["status" => ($conn->query($sql) === TRUE ? "success" : "error")]);
    }
}

$conn->close();
?>
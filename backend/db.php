<?php
$host = "127.0.0.1"; // "localhost" helyett ezt írd be!
$user = "root";
$pass = "";          // Ha MAMP-ot használsz, itt 'root' legyen!
$dbname = "mozimusor";

// Kapcsolódás
$conn = new mysqli($host, $user, $pass, $dbname);

// Hibaellenőrzés
if ($conn->connect_error) {
    die("Hiba a csatlakozáskor: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>
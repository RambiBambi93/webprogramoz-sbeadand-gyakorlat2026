<?php
$servername = "localhost"; // Ez marad localhost!
$username = "mozimusoradatb1"; // Ezt ellenőrizd a Nethely SQL menüpontjában, lehet van előtte egy azonosító (pl. gamf01_...)
$password = "Mozi1_musor2"; 
$dbname = "mozimusoradatb1"; // Ahogy a képen is látszik

$conn = new mysqli($servername, $username, $password, $dbname);
// ... a többi kód változatlan
?>
<?php
// Hibakeresés kényszerítése
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Fejlécek: CORS a React-nek és UTF-8 kódolás
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$type = $_GET['adat'] ?? 'filmek';
$dataDir = __DIR__ . '/../data/';
$files = [
    'filmek' => $dataDir . 'film.txt',
    'mozik'  => $dataDir . 'mozi.txt',
    'helyek' => $dataDir . 'hely.txt'
];

$filePath = $files[$type] ?? $files['filmek'];

if (!file_exists($filePath)) {
    die(json_encode(["error" => "Fajl nem talalhato"]));
}

// 1. Beolvasás és kódolás javítása
$content = file_get_contents($filePath);
// Biztosítjuk az UTF-8 kódolást (ha esetleg ISO-8859-2 lenne a fájl)
if (!mb_check_encoding($content, 'UTF-8')) {
    $content = mb_convert_encoding($content, 'UTF-8', 'ISO-8859-2');
}

// 2. Tisztítás
$content = str_replace("\r", "", trim($content));
$lines = explode("\n", $content);

// 3. Fejléc kinyerése
$headerLine = array_shift($lines);
$header = explode("\t", trim($headerLine));
$colCount = count($header);

$data = [];
$currentRecord = [];

// 4. Intelligens sorfeldolgozás (kezeli a kettétört sorokat)
foreach ($lines as $line) {
    if (trim($line) === "") continue;
    $parts = explode("\t", $line);

    // Ha az első elem szám, az egy ÚJ rekord kezdete (pl. 1, 2, 3...)
    if (is_numeric($parts[0])) {
        // Mentjük az előzőt, ha kész van
        if (!empty($currentRecord) && count($currentRecord) === $colCount) {
            $data[] = array_combine($header, $currentRecord);
        }
        $currentRecord = $parts;
    } else {
        // Ha nem számmal kezdődik, ez a sor az előző rekord folytatása (pl. szétcsúszott cím)
        if (!empty($currentRecord)) {
            $lastIdx = count($currentRecord) - 1;
            $currentRecord[$lastIdx] .= " " . trim($line);
        }
    }
}

// Utolsó rekord mentése
if (!empty($currentRecord) && count($currentRecord) === $colCount) {
    $data[] = array_combine($header, $currentRecord);
}

// 5. JSON kiküldése hibaellenőrzéssel
$jsonOutput = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

if ($jsonOutput === false) {
    echo json_encode(["error" => "JSON hiba: " . json_last_error_msg()]);
} else {
    echo $jsonOutput;
}
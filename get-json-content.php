<?php
header('Content-Type: application/json');

$file = $_GET['file'] ?? '';
if (empty($file) || !file_exists($file) || pathinfo($file, PATHINFO_EXTENSION) !== 'json') {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file']);
    exit;
}

$content = file_get_contents($file);
echo $content;
?> 
<?php
header('Content-Type: application/json');

$file = $_GET['file'] ?? '';
if (empty($file) || !file_exists($file) || pathinfo($file, PATHINFO_EXTENSION) !== 'json') {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file']);
    exit;
}

if (unlink($file) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete file']);
    exit;
}

echo json_encode(['success' => true]);
?> 
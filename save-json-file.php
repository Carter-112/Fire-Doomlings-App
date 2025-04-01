<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$filename = $data['filename'] ?? '';
$content = $data['content'] ?? '';

if (empty($filename) || empty($content) || pathinfo($filename, PATHINFO_EXTENSION) !== 'json') {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

// Validate JSON before saving
$decoded = json_decode($content);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

if (file_put_contents($filename, $content) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit;
}

echo json_encode(['success' => true]);
?> 
<?php
header('Content-Type: application/json');

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate the data
if (!isset($data['filename']) || !isset($data['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$filename = $data['filename'];
$content = $data['content'];

// Validate the filename
if (!preg_match('/^[a-zA-Z0-9_-]+\.json$/', $filename)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid filename']);
    exit;
}

// Validate JSON content
$jsonContent = json_decode($content);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON content']);
    exit;
}

// Save the file
if (file_put_contents($filename, $content) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit;
}

echo json_encode(['success' => true]);
?> 
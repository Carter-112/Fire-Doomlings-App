<?php
header('Content-Type: application/json');

// Get the filename from the query string
$filename = isset($_GET['file']) ? $_GET['file'] : '';

// Validate the filename
if (empty($filename) || !preg_match('/^[a-zA-Z0-9_-]+\.json$/', $filename)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid filename']);
    exit;
}

// Check if the file exists
if (!file_exists($filename)) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit;
}

// Read and return the file contents
$content = file_get_contents($filename);
echo $content;
?> 
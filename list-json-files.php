<?php
header('Content-Type: application/json');

// Get all JSON files in the current directory
$files = glob('*.json');

// Return the list of files
echo json_encode($files);
?> 
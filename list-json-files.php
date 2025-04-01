<?php
header('Content-Type: application/json');

$jsonFiles = glob('*.json');
echo json_encode($jsonFiles);
?> 
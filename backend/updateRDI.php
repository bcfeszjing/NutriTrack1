<?php
header('Content-Type: application/json');

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nutritrack";
$port = 3307;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if RDI value is set
if (!isset($data['rdi'])) {
    echo json_encode(['success' => false, 'message' => 'RDI value not provided']);
    exit();
}

$rdi = (int)$data['rdi']; // Ensure RDI is an integer

// Get user ID from session
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

$userId = $_SESSION['user_id'];

// Update or insert RDI value
$sql = "INSERT INTO rdi (user_id, rdi) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE rdi = VALUES(rdi)";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement: ' . $conn->error]);
    exit();
}

$stmt->bind_param('ii', $userId, $rdi);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'RDI updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update RDI: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>

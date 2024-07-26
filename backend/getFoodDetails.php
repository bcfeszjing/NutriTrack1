<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "nutritrack";
$port = 3307;

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user_id'];
$food_name = $conn->real_escape_string($input['food_name']);
$date = $conn->real_escape_string($input['date']);
$category = $conn->real_escape_string($input['category']);

$sql = "SELECT * FROM user_food_entries WHERE user_id = ? AND food_name = ? AND date = ? AND category = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isss", $user_id, $food_name, $date, $category);
$stmt->execute();

$result = $stmt->get_result();
$foodDetails = $result->fetch_assoc();

echo json_encode($foodDetails);

$stmt->close();
$conn->close();
?>

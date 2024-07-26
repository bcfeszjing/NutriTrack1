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
$category = $input['category'];
$date = $input['date'];
$food_name = $input['food_name'];
$serving_size = $input['serving_size'];
$calories = $input['calories'];
$protein = $input['protein'];
$fat = $input['fat'];
$fiber = $input['fiber'];
$sugar = $input['sugar'];
$carbs = $input['carbs'];

$sql = "INSERT INTO user_food_entries (user_id, category, date, food_name, serving_size, calories, protein, fat, fiber, sugar, carbs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isssissssss", $user_id, $category, $date, $food_name, $serving_size, $calories, $protein, $fat, $fiber, $sugar, $carbs);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

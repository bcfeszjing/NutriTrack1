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

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['foodName']) || !isset($data['date']) || !isset($data['category']) || !isset($data['nutrition'])) {
    echo json_encode(['error' => 'Invalid input']);
    exit();
}

$user_id = $_SESSION['user_id'];
$foodName = $data['foodName'];
$date = $data['date'];
$category = $data['category'];
$servingSize = $data['servingSize'];
$calories = $data['nutrition']['calories'];
$protein = $data['nutrition']['protein'];
$fat = $data['nutrition']['fat'];
$fiber = $data['nutrition']['fiber'];
$sugar = $data['nutrition']['sugar'];
$carbs = $data['nutrition']['carbs'];

$sql = "UPDATE user_food_entries SET serving_size=?, calories=?, protein=?, fat=?, fiber=?, sugar=?, carbs=? WHERE user_id=? AND food_name=? AND date=? AND category=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iddddddisss", $servingSize, $calories, $protein, $fat, $fiber, $sugar, $carbs, $user_id, $foodName, $date, $category);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Failed to update food entry']);
}

$stmt->close();
$conn->close();
?>

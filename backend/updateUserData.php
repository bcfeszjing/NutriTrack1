<?php
//updateUserData.php
session_start();

// Database connection details
$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "nutritrack";
$port = 3307;

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

// Create connection
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);
$field = $input['field'];
$value = $input['value'];
$userId = $_SESSION['user_id'];

// Sanitize input
$field = htmlspecialchars(strip_tags($field));

// Handle profile picture conversion to binary
if ($field === 'profile_picture') {
    if (!empty($value)) {
        $value = base64_decode($value);
    } else {
        $value = null;
    }
} else {
    $value = htmlspecialchars(strip_tags($value));
}

// Hash password if the field is password
if ($field === 'password') {
    $value = password_hash($value, PASSWORD_DEFAULT);
}

// Prepare SQL statement to update user data
$sql = "UPDATE users SET $field=? WHERE id=?";
$stmt = $conn->prepare($sql);

// Bind different types of parameters depending on the field
if ($field === 'profile_picture') {
    $null = null;
    $stmt->bind_param("bi", $null, $userId);
    $stmt->send_long_data(0, $value);
} else {
    $stmt->bind_param("si", $value, $userId);
}

// Execute statement
if ($stmt->execute()) {
    // If the field is birth_date, calculate and update age
    if ($field === 'birth_date') {
        $sql = "UPDATE users SET age=FLOOR(DATEDIFF(CURDATE(), ?) / 365.25) WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $value, $userId);
        $stmt->execute();
    }
    echo json_encode(array("success" => "User data updated successfully"));
} else {
    echo json_encode(array("error" => "Failed to update user data: " . $stmt->error));
}

// Close statement and connection
$stmt->close();
$conn->close();
?>

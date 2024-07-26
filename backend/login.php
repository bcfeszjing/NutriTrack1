<?php
session_start();

$servername = "localhost";
$usernameDB = "root";
$passwordDB = ""; 
$dbname = "nutritrack";
$port = 3307;

// Create connection
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$response = []; // Initialize response array

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user = $conn->real_escape_string($_POST['username']);
    $pass = $_POST['password'];

    // Prepare SQL statement to retrieve user information
    $stmt = $conn->prepare("SELECT * FROM users WHERE username=?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // User found, check password
        $row = $result->fetch_assoc();
        if (password_verify($pass, $row['password'])) {
            // Password matches, set session and return success
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $user;
            $_SESSION['original_password'] = $pass; // Store the original password in the session
            $_SESSION['password_length'] = strlen($pass); // Store the original password length in the session
            $response['success'] = true;
            $response['message'] = 'Login successful.';
        } else {
            // Password does not match
            $response['success'] = false;
            $response['message'] = 'Invalid password. Please try again.';
        }
    } else {
        // No user found with the given username
        $response['success'] = false;
        $response['message'] = 'No user found with that username.';
    }
}

$conn->close();

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>

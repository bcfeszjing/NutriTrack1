<?php
// Database connection details
$servername = "localhost";
$usernameDB = "root";
$passwordDB = ""; 
$dbname = "nutritrack";
$port = 3307;

// Initialize variables to store user input and error messages
$username = $email = $password = '';
$usernameErr = $emailErr = $passwordErr = '';

// Function to sanitize and validate user input
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Form submission handling
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate username
    if (empty($_POST["username"])) {
        $usernameErr = "Username is required";
    } else {
        $username = test_input($_POST["username"]);
        // Check if username only contains letters and numbers
        if (!preg_match("/^[a-zA-Z0-9]*$/", $username)) {
            $usernameErr = "Only letters and numbers allowed";
        }
    }

    // Validate email
    if (empty($_POST["email"])) {
        $emailErr = "Email is required";
    } else {
        $email = test_input($_POST["email"]);
        // Check if email address is well-formed
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $emailErr = "Invalid email format";
        }
    }

    // Validate password
    if (empty($_POST["password"])) {
        $passwordErr = "Password is required";
    } else {
        $password = test_input($_POST["password"]);
        // Additional password validation can be added here if needed
    }

    // If no validation errors, proceed with database insertion
    if (empty($usernameErr) && empty($emailErr) && empty($passwordErr)) {
        // Create connection
        $conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname, $port);

        // Check connection
        if ($conn->connect_error) {
            echo json_encode(['success' => false, 'message' => "Connection failed: " . $conn->connect_error]);
            exit();
        }

        // Check if username or email already exists
        $check_sql = "SELECT * FROM users WHERE username=? OR email=?";
        $stmt = $conn->prepare($check_sql);
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Username or email already exists
            echo json_encode(['success' => false, 'message' => "Username or Email already exists."]);
            $stmt->close();
            $conn->close();
            exit();
        }

        // Hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Prepare SQL statement to insert data into the users table with NULL initial values for optional fields
        $sql = "INSERT INTO users (username, email, password, gender, birth_date, age, weight, height, profile_picture) VALUES (?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL)";
        
        // Prepare statement
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $username, $email, $hashed_password);

        // Execute statement
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => "Sign up successful."]);
            $stmt->close();
            $conn->close();
            exit();
        } else {
            echo json_encode(['success' => false, 'message' => "Error: " . $sql . "<br>" . $conn->error]);
        }

        // Close statement and connection
        $stmt->close();
        $conn->close();
    } else {
        // Return validation errors
        $errors = [];
        if ($usernameErr) $errors[] = $usernameErr;
        if ($emailErr) $errors[] = $emailErr;
        if ($passwordErr) $errors[] = $passwordErr;
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    }
}
?>

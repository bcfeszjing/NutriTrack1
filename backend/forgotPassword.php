<?php
session_start();
header('Content-Type: application/json');

require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "nutritrack";
$port = 3307; // Adjust if your MySQL server runs on a different port

// Create connection
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $conn->real_escape_string($input['email']);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['error' => 'Invalid email format']);
        exit;
    }

    // Check if email exists in database using prepared statement
    $check_sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($check_sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Generate a unique token (a random string or hash)
        $token = bin2hex(random_bytes(32)); // Generate a 32-character hexadecimal token

        // Set token expiration 
        $expires = date('Y-m-d H:i:s', strtotime('+12 hour'));

        // Update token in the database using prepared statement
        $update_sql = "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?";
        $stmt = $conn->prepare($update_sql);
        $stmt->bind_param("sss", $token, $expires, $email);

        if ($stmt->execute()) {
            // Generate reset link
            $reset_link = "http://localhost/NutriTrack/www/php/resetPassword.php?token=$token";

            // Send email using Elastic Email API
            $apiKey = '5C12CA309D6D39028C0D41CAEF50C396C18706A1B5021D286669F4B246BEC585A4CF59BFA899B8561F6A5A4F0784D7EF';
            $url = 'https://api.elasticemail.com/v2/email/send';

            $client = new Client();

            try {
                // Prepare email parameters
                $response = $client->request('POST', $url, [
                    'form_params' => [
                        'apikey'    => $apiKey,
                        'from'      => 'pingsengpoh@gmail.com',
                        'to'        => $email,
                        'subject'   => 'Password Reset Request',
                        'bodyHtml'  => "Hi,<br><br>We received a request to reset your password. Click the link below to reset your password:<br><a href='$reset_link'>$reset_link</a><br><br>If you didn't request this, you can ignore this email.<br><br>Thanks!",
                    ]
                ]);

                $responseBody = json_decode($response->getBody(), true);

                if ($response->getStatusCode() === 200 && $responseBody['success']) {
                    echo json_encode(['success' => true, 'message' => 'Password reset instructions sent to your email.']);
                } else {
                    echo json_encode(['error' => 'Failed to send password reset instructions. Please try again later.', 'details' => $responseBody]);
                }
            } catch (RequestException $e) {
                echo json_encode(['error' => 'Exception when calling Elastic Email API: ' . $e->getMessage()]);
                if ($e->hasResponse()) {
                    echo json_encode(['api_response' => $e->getResponse()->getBody()->getContents()]);
                }
            }
        } else {
            echo json_encode(['error' => 'Error updating record: ' . $stmt->error]);
        }
    } else {
        echo json_encode(['error' => 'No user found with that email.']);
    }

    // Close statement
    $stmt->close();
}

// Close connection
$conn->close();
?>

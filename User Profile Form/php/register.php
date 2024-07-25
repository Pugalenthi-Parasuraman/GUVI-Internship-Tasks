<?php
header('Content-Type: application/json');
require '../vendor/autoload.php';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_management";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection to MySQL failed: " . $e->getMessage()]);
    exit();
}

try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $collection = $client->user_management->profiles;
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Connection to MongoDB failed: " . $e->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['register-username'];
    $password = password_hash($_POST['register-password'], PASSWORD_BCRYPT);
    $email = $_POST['register-email'];

    $stmt = $conn->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
    $mysqlSuccess = $stmt->execute([$username, $password, $email]);

    $user_id = $conn->lastInsertId();

    try {
        $result = $collection->insertOne([
            'user_id' => $user_id,
            'name' => $username,
            'email' => $email
        ]);
        $mongoSuccess = true;
    } catch (Exception $e) {
        $mongoSuccess = false;
        $mongoError = $e->getMessage();
    }

    if ($mysqlSuccess && $mongoSuccess) {
        echo json_encode(["status" => "success", "message" => "Registration successful"]);
    } else {
        $errorMessage = "Registration failed";
        if (!$mysqlSuccess) {
            $errorMessage .= " (MySQL error)";
        }
        if (!$mongoSuccess) {
            $errorMessage .= " (MongoDB error: $mongoError)";
        }
        echo json_encode(["status" => "error", "message" => $errorMessage]);
    }
}
?>
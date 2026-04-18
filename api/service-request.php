<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// ---------- LOAD DEPENDENCIES ----------
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---------- LOAD ENV ----------
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// ---------- ENV CHECK ----------
if (!isset($_ENV['DB_HOST'], $_ENV['MAIL_USER'])) {
    http_response_code(500);
    echo json_encode(["error" => "Environment variables not loaded"]);
    exit;
}

// ---------- METHOD CHECK ----------
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// ---------- GET DATA ----------
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (is_array($data)) {
    $name = trim($data["name"] ?? "");
    $email = trim($data["email"] ?? "");
    $phone = trim($data["phone"] ?? "");
    $service_type = trim($data["service_type"] ?? "");
    $description = trim($data["description"] ?? "");
} else {
    $name = trim($_POST["name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $phone = trim($_POST["phone"] ?? "");
    $service_type = trim($_POST["service_type"] ?? "");
    $description = trim($_POST["description"] ?? "");
}

// ---------- VALIDATION ----------
if (!$name || !$email || !$phone || !$service_type || !$description) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email"]);
    exit;
}

// ---------- DATABASE ----------
$conn = new mysqli(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    $_ENV['DB_NAME']
);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// ---------- INSERT ----------
$stmt = $conn->prepare(
    "INSERT INTO service_requests (name, email, phone, service_type, description)
     VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param("sssss", $name, $email, $phone, $service_type, $description);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save data"]);
    exit;
}

// ---------- EMAIL ----------
try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = $_ENV['MAIL_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['MAIL_USER'];
    $mail->Password   = $_ENV['MAIL_PASS'];
    $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'] === 'tls'
        ? PHPMailer::ENCRYPTION_STARTTLS
        : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $_ENV['MAIL_PORT'];

    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);

    // ---------- ADMIN EMAIL ----------
    $mail->setFrom($_ENV['MAIL_USER'], 'Scalancer');
    $mail->addAddress($_ENV['MAIL_USER']);

    $mail->Subject = 'New Service Request - Scalancer';
    $mail->Body = "
        <h2>New Service Request</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Service:</strong> $service_type</p>
        <p><strong>Description:</strong><br>$description</p>
    ";

    $mail->send();

    // ---------- USER EMAIL ----------
    $mail->clearAddresses();

    $mail->addAddress($email);
    $mail->Subject = 'We received your request - Scalancer';
    $mail->Body = "
        <p>Hi <strong>$name</strong>,</p>
        <p>Thank you for contacting <strong>Scalancer</strong>.</p>
        <p>Our team will get back to you shortly.</p>
        <br>
        <p>— Scalancer Team</p>
    ";

    $mail->send();

} catch (Exception $e) {
    error_log("Mailer Error: " . $mail->ErrorInfo);

    http_response_code(500);
    echo json_encode(["error" => "Email sending failed"]);
    exit;
}

// ---------- SUCCESS RESPONSE ----------
echo json_encode([
    "success" => true,
    "message" => "Request submitted successfully"
]);

$stmt->close();
$conn->close();
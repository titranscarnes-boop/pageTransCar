<?php
// Backend del formulario de contacto de opltranscarnes.com
// Recibe el POST del formulario, valida los datos y envía el correo.

header('Content-Type: application/json; charset=utf-8');

function respond($ok, $message) {
    http_response_code($ok ? 200 : 400);
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Método no permitido.');
}

// Honeypot anti-spam: los bots suelen rellenar todos los campos, las
// personas nunca ven ni llenan este (está oculto con CSS).
if (!empty($_POST['website'])) {
    respond(true, 'Gracias por tu mensaje.');
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? 'Contacto desde el sitio web');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    respond(false, 'Por favor completa todos los campos requeridos.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'El correo electrónico no es válido.');
}

// Límite de tamaño para evitar abuso
if (mb_strlen($message) > 5000) {
    $message = mb_substr($message, 0, 5000);
}

$to = 'comercial@transcarnes.com';
$fullSubject = '[Sitio web] ' . $subject . ' - ' . $name;

$body  = "Nuevo mensaje desde el formulario de opltranscarnes.com\n\n";
$body .= "Nombre: $name\n";
$body .= "Correo: $email\n";
$body .= "Asunto: $subject\n\n";
$body .= "Mensaje:\n$message\n";

$headers  = "From: Sitio Web Transcarnes <no-reply@opltranscarnes.com>\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to, $fullSubject, $body, $headers);

if ($sent) {
    respond(true, 'Gracias por tu mensaje. Te contactaremos pronto.');
} else {
    respond(false, 'Hubo un problema al enviar tu mensaje. Intenta de nuevo o escríbenos directamente a comercial@transcarnes.com.');
}

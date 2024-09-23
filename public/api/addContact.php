<?php

session_start();

if ($_SESSION['logged_in']) {
	$inData = getRequestInfo();

	$first = $inData["first_name"];
	$last = $inData["last_name"];
	$phone = $inData["phone_number"];
	$email = $inData["email"];

	$keys_exist = true;
	$keys_exist = $keys_exist && isset($inData["first_name"]);
	$keys_exist = $keys_exist && isset($inData["last_name"]);
	$keys_exist = $keys_exist && isset($inData["phone_number"]);
	$keys_exist = $keys_exist && isset($inData["email"]);

	if ($keys_exist) {
		$database_url = parse_url(getenv('DATABASE_URL'));

		$server = $database_url['host'];
		$user = $database_url['user'];
		$pass = $database_url['pass'];
		$db = substr($database_url['path'], 1);

		$conn = new mysqli($server, $user, $pass, $db);

		if ($conn->connect_errno) {
			sendInternalError();
		} else {
			$stmt = $conn->prepare("INSERT INTO contacts (first_name, last_name, phone_number, email, user_id) VALUES (?, ?, ?, ?, ?)");
			$stmt->bind_param("sssss", $first, $last, $phone, $email, $_SESSION['id']);

			if ($stmt->execute()) {
				sendResponse(200, "success", "");
			} else {
				sendInternalError();
			}

			$stmt->close();
			$conn->close();
		}
	} else {
		sendResponse(400, "bad_request", "missing required api parameters");
	}
} else {
	sendResponse(401, "unauthorized", "user is not logged in");
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

function sendResponse($http_code, $status, $desc)
{
	$res = '{"status": "' . $status . '", "desc": "' . $desc . '"}';
	http_response_code($http_code);
	sendResultInfoAsJson($res);
}

function sendInternalError()
{
	$res = '{"status": "error", "desc": "internal error"}';
	http_response_code(500);
	sendResultInfoAsJson($res);
}

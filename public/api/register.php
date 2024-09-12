<?php

$inData = getRequestInfo();

$keys_exist = true;
$keys_exist = $keys_exist && isset($inData['first_name']);
$keys_exist = $keys_exist && isset($inData['last_name']);
$keys_exist = $keys_exist && isset($inData['username']);
$keys_exist = $keys_exist && isset($inData['password']);

if ($keys_exist) {
	$firstName = $inData["first_name"];
	$lastName = $inData["last_name"];
	$username = $inData["username"];
	$password = $inData["password"];

	$database_url = parse_url(getenv('DATABASE_URL'));

	$server = $database_url['host'];
	$user = $database_url['user'];
	$pass = $database_url['pass'];
	$db = substr($database_url['path'], 1);

	$conn = new mysqli($server, $user, $pass, $db);
	if ($conn->connect_errno) {
		sendInternalError();
	} else {
		$stmt = $conn->prepare("SELECT id FROM users WHERE username=BINARY ?");
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($result->num_rows > 0) {
			sendResponse(409, "register_fail", "username taken");
		} else {
			$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);

			if ($stmt->execute()) {
				sendResponse(200, "success", "");
			} else {
				sendInternalError();
			}
		}

		$stmt->close();
		$conn->close();
	}
} else {
	sendResponse(400, "bad_request", "missing required api parameters");
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
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

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

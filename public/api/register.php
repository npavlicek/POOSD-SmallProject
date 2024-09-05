<?php

$inData = getRequestInfo();

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
if ($conn->connect_error) {
	$res = '{"status":"error", "desc":"could not connect to database"}';
	sendResultInfoAsJson($res);
} else {
	$stmt = $conn->prepare("SELECT id FROM users WHERE username=?");
	$stmt->bind_param("s", $username);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows > 0) {
		$res = '{"status":"registerfail", "desc":"username taken"}';
		sendResultInfoAsJson($res);
	} else {
		$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);

		if ($stmt->execute()) {
			$res = '{"status":"success", "desc":""}';
			sendResultInfoAsJson($res);
		} else {
			$res = '{"status":"error", "desc":"could not execute registration"}';
			sendResultInfoAsJson($res);
		}
	}

	$stmt->close();
	$conn->close();
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
	http_response_code(200);
	header('Content-type: application/json');
	echo $obj;
}

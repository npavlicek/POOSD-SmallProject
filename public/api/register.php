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
	registerError();
} else {
	$stmt = $conn->prepare("SELECT id FROM users WHERE username=?");
	$stmt->bind_param("s", $username);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows > 0) {
		registerError();
	} else {
		$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);

		if ($stmt->execute()) {
			$id = $stmt->insert_id;
			registerSuccess();
		} else {
			registerError();
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
	header('Content-type: application/json');
	echo $obj;
}

function registerSuccess()
{
	http_response_code(200);
	$res = '{"status":"success"}';
	sendResultInfoAsJson($res);
}

function registerError()
{
	http_response_code(300);
	$res = '{"status":"error"}';
	sendResultInfoAsJson($res);
}

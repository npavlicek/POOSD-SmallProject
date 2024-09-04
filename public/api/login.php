<?php

$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";

$database_url = parse_url(getenv('DATABASE_URL'));

$server = $database_url['host'];
$user = $database_url['user'];
$pass = $database_url['pass'];
$db = substr($database_url['path'], 1);

$conn = new mysqli($server, $user, $pass, $db);
if ($conn->connect_error) {
	loginError("could not connect to database");
} else {
	$stmt = $conn->prepare("SELECT id,first_name,last_name FROM users WHERE username=? AND password=?");
	$stmt->bind_param("ss", $inData["login"], $inData["password"]);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = $result->fetch_assoc()) {
		session_start();
		$_SESSION["id"] = $row['id'];

		loginSuccess();
	} else {
		loginError("wrong credentials");
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

function loginSuccess()
{
	http_response_code(200);
	$retValue = '{"status":"success"}';
	sendResultInfoAsJson($retValue);
}

function loginError($response)
{
	http_response_code(401);
	$retValue = '{"status":"' . $response . '"}';
	sendResultInfoAsJson($retValue);
}

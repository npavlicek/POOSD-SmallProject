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
	$response = '{"status":"error","desc":"could not connect to database"}';
	sendResultInfoAsJson($response);
} else {
	$stmt = $conn->prepare("SELECT id,first_name,last_name FROM users WHERE username=? AND password=?");
	$stmt->bind_param("ss", $inData["login"], $inData["password"]);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = $result->fetch_assoc()) {
		session_start();
		$_SESSION["id"] = $row['id'];
    
		$response = '{"status":"success", "desc":""}';
		sendResultInfoAsJson($response);
	} else {
		$response = '{"status":"loginfail", "desc":"incorrect credentials"}';
		sendResultInfoAsJson($response);
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

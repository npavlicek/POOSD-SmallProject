<?php

$inData = getRequestInfo();

$first_name = $inData["first name"];
$last_name = $inData["last_name"];
$userId = $inData["userId"];

$database_url = parse_url(getenv('DATABASE_URL'));

$server = $database_url['host'];
$user = $database_url['user'];
$pass = $database_url['pass'];
$db = substr($database_url['path'], 1);

$conn = new mysqli($server, $user, $pass, $db);

if ($conn->connect_error) 
{
	returnWithError($conn->connect_error);
} else 
{
	$stmt = conn->prepare("INSERT into contacts (UserID, first, last) Values(?, ?, ?)");
	$stmt->bind_param("ss", $userId, $first_name, $last_name);
	$stmt->execute();
	$stmt->clost();
	$conn->close();
	returnWithError("");
}
	
	
	
function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err)
{
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}
?>
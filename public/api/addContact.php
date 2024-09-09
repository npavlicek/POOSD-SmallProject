<?php

$inData = getRequestInfo();

$first = $inData["first name"];
$last = $inData["last_name"];
$phone = $inData["phone_number"];
$email = $inData["email"];
$user_id = $inData["user_id"];
$id = $inData["id"];

$database_url = parse_url(getenv('DATABASE_URL'));

$server = $database_url['host'];
$user = $database_url['user'];
$pass = $database_url['pass'];
$db = substr($database_url['path'], 1);

$conn = new mysqli($server, $user, $pass, $db);

if ($conn->connect_error) 
{
	returnWithError("Trouble Connecting to database");
} else 
{
	$stmt = conn->prepare("INSERT into contacts (first_name, last_name, phone_number, email, user_id, id) Values(?, ?, ?, ?, ?, ?)");
	$stmt->bind_param("ssssss", $first, $last, $phone, $email, $user_id, $id);
	if(!$stmt->execute())
	{
		returnWithError("unable to add contact");
	} else
	{
		$stmt->close();
		$conn->close();
		returnWithError("");
	}
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
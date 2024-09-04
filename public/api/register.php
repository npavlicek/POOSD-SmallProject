<?php 
	
	$inData = getRequestInfo();
	
	$firstName = $inData["first_name"];
	$lastName = $inData["last_name"];
	$username = $inData["login"];
	$password = $inData["password"];
	
	$database_url = parse_url(getenv('DATABASE_URL'));

	$server = $database_url['host'];
	$user = $database_url['user'];
	$pass = $database_url['pass'];
	$db = substr($database_url['path'], 1);
	
	$conn = new mysqli($server, $user, $pass, $db);
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("SELECT id FROM users WHERE username=?");
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();
		
		if ($result->num_rows > 0)
		{
			returnWithError("Username already exists");
		}
		else
		{
			$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);
		
			if ($stmt->execute())
			{
				$id = $stmt->insert_id;
				returnWithInfo($firstName, $lastName, $id);
			}
			else
			{
				returnWithError("Failed to register user");
			}
		}
		
		$stmt->close();
		$conn->close();
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
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
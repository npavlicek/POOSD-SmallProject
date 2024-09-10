<?php

$inData = getRequestInfo();
	
$searchResults = "";
$searchCount - 0;	

$database_url = parse_url(getenv('DATABASE_URL'));

$server = $database_url['host'];
$user = $database_url['user'];
$pass = $database_url['pass'];
$db = substr($database_url['path'], 1);

$conn = new mysqli($server, $user, $pass, $db);
if($conn->connect_errno) 
{
	returnWithError("Trouble connecting to database");
}
else
{
	$stmt = $conn->prepare("select * from Contacts where (first_name like ? OR last_name like ?)  and user_id=?");
	$name = "%" . $inData["search"] . "%";
	stmt->bind_param("sss", $name, $name, $inData["user_id"]);
	if(!stmt->execute())
	{
		returnWithError("Unable to complete search");
	}
	else
	{
		$stmt->execute();
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if($searchCount > 0)
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"first name" : "' . $row["first_name"]. '", "last name" : "' . $row[last_name]. '", "Phone" : "' . $row["phone_number"]. '", "Email" : "' . $row["email"] . '"}';
		}
		
		if($searchCount == 0 )
		{
			returnWithError("No Records Found");
		}
		else
		{
			returnWithInfo( $searchResults );
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
		$retValue = '{"id":0,"first_name":"","last_name":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $searchResults )
{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
}


?>
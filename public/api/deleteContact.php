<?php

    session_start();
  
    $inData = getRequestInfo();
  
  	$database_url = parse_url(getenv('DATABASE_URL'));
  
  	$server = $database_url['host'];
    $username = $database_url['user'];
    $password = $database_url['pass'];
    $db = substr($database_url['path'], 1);
  
  
    $conn = new mysqli($server, $username, $password, $db);
  	{
  		returnWithError( $conn->connect_error );
  	} 
  	else
  	{
   
  		$stmt = $conn->prepare("DELETE FROM contacts WHERE id = ? AND user_id = ?");        
       
      if ($stmt === false) {
          returnWithError("Prepare failed: " . $conn->error);
      }
                    
  		$stmt->bind_param("ss", $inData["id"], $_SESSION['id']);
    
      if ($stmt->execute()) {
        returnWithInfo("deleted successfully!");
      } else {
        returnWithError("Deletion failed: " . $stmt->error);
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
  		$retValue = json_encode(["id" => 0, "firstName" => "", "lastName" => "","phone_number" => "","email" => "", "error" => $err]);
  		sendResultInfoAsJson( $retValue );
  	}
  	
   function returnWithInfo($message)
    {
      $retValue = json_encode(["message" => $message, "error" => ""]);
      sendResultInfoAsJson($retValue);
    }
  
?>


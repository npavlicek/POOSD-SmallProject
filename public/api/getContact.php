<?php

session_start();

if ($_SESSION['logged_in']) {
	$inData = getRequestInfo();

	$first = $inData["contact_id"];

	$keys_exist = true;
	$keys_exist = $keys_exist && isset($inData["contact_id"]);

	if ($keys_exist) {
		$database_url = parse_url(getenv('DATABASE_URL'));

		$server = $database_url['host'];
		$user = $database_url['user'];
		$pass = $database_url['pass'];
		$db = substr($database_url['path'], 1);

		$conn = new mysqli($server, $user, $pass, $db);

		if ($conn->connect_errno) {
			sendInternalError();
		} else {
			$stmt = $conn->prepare("SELECT first_name, last_name, email, phone_number, date_created FROM contacts WHERE user_id=? AND id=?;");
			$stmt->bind_param("ss", $_SESSION['id'], $inData["contact_id"]);

			if ($stmt->execute()) {
				$sql_res = $stmt->get_result();

				if ($sql_res->num_rows > 0) {
					$contact_info = $sql_res->fetch_assoc();

					$res = "{ \"status\": \"success\", \"desc\": \"\", \"first_name\": \"{$contact_info["first_name"]}\",
					\"last_name\": \"{$contact_info["last_name"]}\", \"email\": \"{$contact_info["email"]}\", 
					\"phone_number\": \"{$contact_info["phone_number"]}\", \"date_created\": \"{$contact_info["date_created"]}\",
					\"id\": {$inData["contact_id"]}
					}";

					http_response_code(200);
					sendResultInfoAsJson($res);
				} else {
					sendResponse(404, "invalid_id", "requested contact does not exist");
				}
			} else {
				sendInternalError();
			}

			$stmt->close();
			$conn->close();
		}
	} else {
		sendResponse(400, "bad_request", "missing required api parameters");
	}
} else {
	sendResponse(401, "unauthorized", "user is not logged in");
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

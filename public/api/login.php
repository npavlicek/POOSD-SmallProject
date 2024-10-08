<?php

session_start();

$inData = getRequestInfo();

$keys_exist = true;
$keys_exist = $keys_exist && isset($inData['username']);
$keys_exist = $keys_exist && isset($inData['password']);

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
		$stmt = $conn->prepare("SELECT id,first_name,last_name,password FROM users WHERE username=BINARY ?");
		$stmt->bind_param("s", $inData["username"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($result->num_rows > 0) {
			$row = $result->fetch_assoc();

			if (password_verify($inData["password"], $row["password"])) {
				$_SESSION['logged_in'] = true;
				$_SESSION['id'] = $row['id'];
				$_SESSION['first_name'] = $row['first_name'];
				$_SESSION['last_name'] = $row['last_name'];

				$timestamp = new DateTime();
				$conn->execute_query("UPDATE users SET date_last_logged_in=? WHERE id=?;", [$timestamp->format('Y-m-d H:i:s'), $row['id']]);

				sendResponse(200, "success", "");
			} else {
				sendResponse(401, "login_fail", "incorrect credentials");
			}
		} else {
			sendResponse(401, "login_fail", "incorrect credentials");
		}

		$stmt->close();
		$conn->close();
	}
} else {
	sendResponse(400, "bad_request", "missing required properties");
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendInternalError()
{
	sendResponse(500, "error", "internal error");
}

function sendResponse($http_code, $status, $desc)
{
	$res = '{"status": "' . $status . '", "desc":"' . $desc . '"}';
	http_response_code($http_code);
	sendResultInfoAsJson($res);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

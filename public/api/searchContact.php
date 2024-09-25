<?php

session_start();

/*
* api endpoint:
*
* {
*	"limit": number,
*	"offset": number,
*	"search_query": string, // NOT REQUIRED, if no query is present this endpoint will return every contact
* }
*/

if ($_SESSION['logged_in']) {
	$inData = getRequestInfo();

	$keys_exist = true;
	$keys_exist = $keys_exist && isset($inData["limit"]);
	$keys_exist = $keys_exist && isset($inData["offset"]);

	$search_query = null;
	if (isset($inData["search_query"])) {
		$search_query = $inData["search_query"];
	} else {
		$search_query = "%";
	}

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
			$query = "SELECT * FROM contacts ";

			if (isset($inData["search_query"])) {
				$query = $query . "WHERE (first_name LIKE CONCAT('%', ?, '%') OR last_name LIKE CONCAT('%', ?, '%') 
				OR phone_number LIKE CONCAT('%', ?, '%') OR email LIKE CONCAT('%', ?, '%')) 
				AND user_id=? 
				ORDER BY first_name, last_name, email, phone_number";
			} else {
				$query = $query . "WHERE user_id=? ORDER BY id DESC";
			}

			$query = $query . " LIMIT ? OFFSET ?;";

			$stmt = $conn->prepare($query);

			if (isset($inData["search_query"])) {
				$stmt->bind_param(
					"ssssiii",
					$inData['search_query'],
					$inData['search_query'],
					$inData['search_query'],
					$inData['search_query'],
					$_SESSION['id'],
					$inData['limit'],
					$inData['offset']
				);
			} else {
				$stmt->bind_param(
					"iii",
					$_SESSION['id'],
					$inData['limit'],
					$inData['offset']
				);
			}

			if ($stmt->execute()) {
				$res = $stmt->get_result();

				if ($res->num_rows > 0) {
					$res_json = "{ \"results\": [";

					$idx = 0;
					while ($cur_field = $res->fetch_assoc()) {
						if ($idx != 0) $res_json = $res_json . ",";

						$res_json = $res_json . "{";

						$res_json = $res_json . "\"first_name\": \"" . $cur_field["first_name"] . "\",";
						$res_json = $res_json . "\"last_name\": \"" . $cur_field["last_name"] . "\",";
						$res_json = $res_json . "\"phone_number\": \"" . $cur_field["phone_number"] . "\",";
						$res_json = $res_json . "\"email\": \"" . $cur_field["email"] . "\",";
						$res_json = $res_json . "\"date_created\": \"" . $cur_field["date_created"] . "\",";
						$res_json = $res_json . "\"id\": \"" . $cur_field["id"] . "\"";

						$res_json = $res_json . "}";

						$idx = $idx + 1;
					}

					$res_json = $res_json . "], \"status\": \"success\"}";

					sendResultInfoAsJson($res_json);
				} else {
					sendResultInfoAsJson("{ \"status\": \"success\", \"results\": [] }");
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

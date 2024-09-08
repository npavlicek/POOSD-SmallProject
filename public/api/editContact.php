<?php

session_start();

if ($_SESSION["logged_in"]) {
        $inData = getRequestInfo();

        $keys_exist = true;
        $keys_exist = $keys_exist && isset($inData["first_name"]);
        $keys_exist = $keys_exist && isset($inData["last_name"]);
        $keys_exist = $keys_exist && isset($inData["phone_number"]);
        $keys_exist = $keys_exist && isset($inData["email"]);
        $keys_exist = $keys_exist && isset($inData["contact_id"]);

        if ($keys_exist) {
                $database_url = parse_url(getenv('DATABASE_URL'));

                $server = $database_url['host'];
                $username = $database_url['user'];
                $password = $database_url['pass'];
                $db = substr($database_url['path'], 1);

                $conn = new mysqli($server, $username, $password, $db);
                if ($conn->connect_errno) {
                        sendInternalError();
                } else {
                        $cnct_exists = checkContactExists($conn, $inData["contact_id"]);

                        if ($cnct_exists) {
                                $stmt = $conn->prepare("UPDATE contacts SET first_name = ?, last_name = ?, phone_number = ?, email = ? WHERE id = ? AND user_id = ?;");

                                if ($stmt == false) {
                                        sendInternalError();
                                } else {
                                        $stmt->bind_param("ssssss", $inData["first_name"], $inData["last_name"], $inData["phone_number"], $inData["email"], $inData["contact_id"], $_SESSION['id']);

                                        if ($stmt->execute()) {
                                                sendResponse(200, "success", "");
                                        } else {
                                                sendInternalError();
                                        }

                                        $stmt->close();
                                        $conn->close();
                                }
                        } else {
                                sendResponse(404, "contact_id_not_found", "the supplied contact id does not exist");
                        }
                }
        } else {
                sendResponse(400, "bad_request", "missing required api parameters");
        }
} else {
        sendResponse(401, "unauthorized", "user is not logged in");
}

function checkContactExists($conn, $contact_id)
{
        $stmt = $conn->prepare("SELECT 1 FROM contacts WHERE id=? AND user_id=?");
        if ($stmt == false) {
                sendInternalError();
        } else {
                $stmt->bind_param("ss", $contact_id, $_SESSION["id"]);
                if ($stmt->execute()) {
                        $stmt->store_result();
                        if ($stmt->num_rows > 0) {
                                return true;
                        } else {
                                return false;
                        }
                } else {
                        sendInternalError();
                }
        }
        $stmt->close();
        return false;
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

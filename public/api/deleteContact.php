<?php

// If the session is active
if (session_status() == PHP_SESSION_ACTIVE) {
        $inData = getRequestInfo();

        $keys_exist = true;
        $keys_exist = $keys_exist and array_key_exists("contact_id", $inData);

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
                                $stmt = $conn->prepare("DELETE FROM contacts WHERE id = ? AND user_id = ?");

                                if ($stmt == false) {
                                        sendInternalError();
                                } else {
                                        $stmt->bind_param("ss", $inData["contact_id"], $_SESSION['id']);

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
        $stmt = $conn->prepare("SELECT EXISTS(SELECT 1 FROM contacts WHERE id=? AND user_id=?)");
        if ($stmt == false) {
                sendInternalError();
        } else {
                $stmt->bind_param("ss", $contact_id, $_SESSION["id"]);
                if ($stmt->execute()) {
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

function sendResultInfoAsJson($obj)
{
        header('Content-type: application/json');
        echo $obj;
}

<?php

header('Content-type: application/json');

$database_url = parse_url(getenv('DATABASE_URL'));

$server = $database_url['host'];
$username = $database_url['user'];
$password = $database_url['pass'];
$db = substr($database_url['path'], 1);

$connection = new mysqli($server, $username, $password, $db);

$result = $connection->query("SELECT * FROM contacts");

$response_data = [];

$idx = 0;
for ($row_no = $result->num_rows - 1; $row_no >= 0; $row_no--) {
	$response_data[$idx] = [];
	$result->data_seek($row_no);
	$row = $result->fetch_assoc();
	$response_data[$idx]['first_name'] = $row['first_name'];
	$response_data[$idx]['last_name'] = $row['last_name'];
	$response_data[$idx]['phone_number'] = $row['phone_number'];
	$response_data[$idx]['email'] = $row['email'];
	$response_data[$idx]['time_created'] = $row['time_created'];
	$idx++;
}

$connection->close();

echo json_encode($response_data);

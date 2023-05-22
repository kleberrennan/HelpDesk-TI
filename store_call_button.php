<?php

include('connection.php');

$name_sector = $_POST['user_name'];
$reason_request = $_POST['reason'];
$timestamp = date('Y-m-d H:i:s');

$sql_query = "INSERT INTO sch_iterma.tbl_reason_form(id_reason, name_sector, time_date, reason_request) VALUES(DEFAULT, '$name_sector', '$timestamp', '$reason_request')";
$sql_query_reason_exists = "SELECT * FROM sch_iterma.tbl_reason_form WHERE name_sector='$name_sector'";

$exec_query_reason_exists = pg_query($sql_query_reason_exists);
if(pg_num_rows($exec_query_reason_exists) == 0) {
	pg_query($dbconn, $sql_query) or die("Error to send Call Data! Error: " . pg_last_error());
} else { 
	$response = 'Exists';
}   

echo $response;
pg_close();
?>

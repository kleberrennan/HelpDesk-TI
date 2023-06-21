<?php

include('connection.php');

$name_sector = $_POST['user_name'];

$reason_request = $_POST['reason'];

$timezone = new DateTimeZone('America/Belem');
$timedate = new DateTime('now', $timezone);
$timedate->modify('-6 hours');

$getTimeDate = $timedate->getTimestamp();

$timestamp = date('Y-m-d H:i:s', $getTimeDate);

$sql_query = "INSERT INTO sch_iterma.tbl_reason_form(id_reason, name_sector, time_date, reason_request) VALUES(DEFAULT, '$name_sector', '$timestamp', '$reason_request')";
$sql_query_reason_exists = "SELECT * FROM sch_iterma.tbl_reason_form WHERE name_sector='$name_sector'";

if(is_null($name_sector)) {
	exit();
} else {
	$NoExistsRow = 'NoExists';
	$ExistsRow = 'ExistsRow';
	$data_arr = array();
	$exec_query_reason_exists = pg_query($sql_query_reason_exists);
	$num_rows = pg_num_rows($exec_query_reason_exists);

	if($num_rows == 0) {
		echo($NoExistsRow);
		pg_query($dbconn, $sql_query) or die("Error to send Call Data! Error: " . pg_last_error());
		unset($ExistsRow);
		array_push($data_arr, $name_sector, $reason_request, $timestamp);
		$jsonArr = json_encode($data_arr);
		echo $jsonArr;
	} else { 
		unset($NoExistsRow);
		unset($data_arr);
		echo $ExistsRow;
	}  
} 
pg_close();
?>

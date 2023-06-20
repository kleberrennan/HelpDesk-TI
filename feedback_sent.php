<?php
include('./connection.php');

$tbl_name = 'sch_iterma.tbl_feedback';

$feedback_text = $_POST['feedback_msg'];
$name_sector = $_POST['name_sector'];

$timezone = new DateTimeZone('America/Belem');
$timedate = new DateTime('now', $timezone);
$timedate->modify('-3 hours');

$getTimedate = $timedate->getTimestamp();

$timestamp = date('Y-m-d H:i:s', $getTimedate);

$insert_query = "INSERT INTO $tbl_name(name_sector, feedback_msg, feedback_timesent)
	VALUES('$name_sector', '$feedback_text', '$timestamp')";

$pg_result = pg_query($insert_query);

echo "Sent with Sucess!";

pg_close($dbconn);
?>

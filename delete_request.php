<?php
	include('./connection.php');
	
	$tbl_request_name = "sch_iterma.tbl_reason_form";
	$tbl_notific = "sch_iterma.tbl_notification";

	#$name_sector = $_POST['name_sector'];
	$id_request = $_POST['id_request'];

	$fetch_request = "DELETE FROM ${tbl_request_name} WHERE id_reason=${id_request}";
	#$notification_status = "UPDATE $tbl_notific SET status_notified = '1' WHERE name_sector = $name_sector";
	echo $id_request;
	pg_query($fetch_request);

	pg_close($dbconn);
?>

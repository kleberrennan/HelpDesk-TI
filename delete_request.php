<?php
	include('./connection.php');
	
	$tbl_request_name = "sch_iterma.tbl_reason_form";
	$tbl_request_fk = "sch_iterma.tbl_reason_descp";

	$tbl_notific = "sch_iterma.tbl_notification";

	$id_request = $_POST['id_request'];

	$fetch_request_parent = "DELETE FROM {$tbl_request_name} WHERE id_reason={$id_request}";

	$fetch_request_child = "DELETE FROM {$tbl_request_fk} WHERE id_reason=(select id_reason from $tbl_request_name where id_reason = {$id_request})";
	echo $id_request;

	pg_query($fetch_request_child);
	pg_query($fetch_request_parent);

	pg_close($dbconn);
?>

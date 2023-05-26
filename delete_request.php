<?php
	include('./connection.php');
	
	$tbl_request_name = "sch_iterma.tbl_reason_form";

	$id_request = $_POST['id_request'];

	$fetch_request = "DELETE FROM ${tbl_request_name} WHERE id_reason=$id_request";
	echo $id_request;
	pg_query($fetch_request);

	pg_close($dbconn);
?>

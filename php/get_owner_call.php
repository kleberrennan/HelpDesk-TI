<?php
include('./connection.php');

$name_table = 'sch_iterma.tbl_reason_form';

$sector_id = $_POST['sector_id'];

$pg_select_query = "SELECT owner_request FROM {$name_table} WHERE id_reason = '{$sector_id}'";

$result_query = pg_query($pg_select_query);

if($result_query) {
	$row = pg_fetch_assoc($result_query);
	$owner_request = $row['owner_request'];
	$response = $owner_request;
} else {
	$response = 'Sem posse';
}

echo $response;

pg_close($dbconn);
?>

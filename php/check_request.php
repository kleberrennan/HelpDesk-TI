<?php
include('./connection.php');

$tbl_name = 'tbl_reason_form';

$id_sector = $_POST['id_sector'];

$select_check = "SELECT id_sector FROM $tbl_name WHERE id_sector=$id_sector";

$pg_result = pg_query($select_check);

$response = '';

if(pg_num_rows($pg_result) == 0) {
	$response = 'reload';
}

echo $response;

pg_close($dbconn);
?>

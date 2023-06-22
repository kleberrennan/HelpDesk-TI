<?php
include './connection.php';

$name_table = 'sch_iterma.tbl_reason_form';

$name_worker = $_POST['name_worker'];
$id_request = $_POST['button_id'];

$pg_insert_query = "UPDATE $name_table
	SET owner_request='$name_worker' 
	WHERE id_reason = '$id_request'";

$result_query = pg_query($dbconn, $pg_insert_query);

echo "$name_worker";
pg_close($dbconn);
?>

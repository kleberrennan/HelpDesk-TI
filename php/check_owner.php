<?php
include('./connection.php');

$table_name = 'sch_iterma.tbl_reason_form';

$column_name = 'owner_request';

$name_session_user = $_POST['nameUser'];

$query_sql = "SELECT $column_name FROM $table_name WHERE name_sector = '$name_session_user'";

$status_owner = 0;

$result_fetch = pg_query($query_sql);

while($row = pg_fetch_assoc($result_fetch)) {
	$owner_request = $row["$column_name"];

	if(is_null($owner_request)) {
		$status_owner = '';
	} else {
		$status_owner = $owner_request;
	}
}

echo $status_owner;
pg_close($dbconn);
?>

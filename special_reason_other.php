<?php
include('./connection.php');

$data_descp = $_POST['data_descp'];
$name_user = $_POST['name_sector'];

$table_name_fk = 'sch_iterma.tbl_reason_descp';

$table_name_main = 'sch_iterma.tbl_reason_form';

$insert_query = "INSERT INTO $table_name_fk(id_reason, reason_descp) VALUES((SELECT id_reason FROM $table_name_main WHERE name_sector = '$name_user'), '$data_descp')";

$check_if_exists = "SELECT * FROM $table_name_fk WHERE id_reason = (SELECT id_reason FROM $table_name_main WHERE name_sector = '$name_user')";

$result_fetch = pg_query($insert_query);

$result_fetch_exists = pg_query($check_if_exists);

echo 'Sent Sucessfully Description Reason!';

while($row = pg_fetch_assoc($result_fetch_exists)) {

	$descp_reason = $row['reason_descp'];

	echo $descp_reason;
};
pg_close($dbconn);
?>

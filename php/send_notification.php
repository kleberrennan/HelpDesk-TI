<?php
session_start();
include('./connection.php');

$table_notification = 'sch_iterma.tbl_notification';

if($_SERVER['REQUEST_METHOD'] === 'POST') {
	$title = $_POST['title'];	
	$notification = $_POST['notification'];
	$recipient = $_POST['recipient'];	
	$user_session = $_SESSION['user_name'];

	$sucess_msg = "Sucesfully posted!";
	$failed_msg = "Already Exists!";

	$sql_check = "SELECT name_sector from $table_notification";

	$result_check = pg_query($sql_check);

	echo $sucess_msg;

	$sql_insert = "INSERT INTO $table_notification(title, description, name_sector,	user_notified, status_notified) VALUES ('$title', '$notification', '$user_session', '$recipient', 1)";

	pg_query($dbconn, $sql_insert);
}

if($_SERVER['REQUEST_METHOD'] === 'GET') { 

	$sql_query = "SELECT * FROM $table_notification";

	$result = pg_query($sql_query);

	if(!$result) {
		echo "Query Execution Failed: " . pg_last_error();
	} else {
		$data_notific = array();

		if(pg_num_rows($result) > 0) {
			while ($row = pg_fetch_assoc($result)) {
				$title_notific = $row["title"];
				$descp_notific = $row["description"];
				$name_sector_notific = $row["name_sector"];
				$user_notific = $row["user_notified"];
				$status_notific = $row["status_notified"];

				$data_notific = array(
					"title" => $title_notific,
					"description" => $descp_notific,
					"name_sector" => $name_sector_notific,
					"user_notified" => $user_notific,
					"status_notified" => $status_notific
					);
			};

			echo json_encode($data_notific); 
			} else {
				unset($data_notific);
				echo "No results was found!";
			}
		};
	}; 
?>

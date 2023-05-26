<?php
	include('./connection.php');

	if(!isset($_SESSION)) {
		session_start();
	}
	
	$tbl_name = "sch_iterma.tbl_reason_form";

	$fetch_query = "SELECT * FROM $tbl_name";
	
	$result_fetch = pg_query($fetch_query);

	$divElements = '';

	if(pg_num_rows($result_fetch) > 0) {
		while($row = pg_fetch_assoc($result_fetch)) {
			$name_sector = $row['name_sector'];
			$time_date = $row['time_date'];
			$reason_request = $row['reason_request'];
			$id_request = $row['id_reason'];

			$dynamicRequest = "<p class='sector-content' style='font-size: 1.4em; text-transform: uppercase; letter-spacing: 1px; line-height: 1.3em; color: #fff; position: relative; font-weight: 500;'>Setor: $name_sector<br>Razão: $reason_request<br>Hora: $time_date</p><button type='button' id='idButton_$id_request' onClick='buttonDeleteCall($id_request)'style='display: flex; text-align: center; align-items: center; background-color: #067c18; border: none; cursor: pointer; border-radius: 2em; align-self: flex-end; width: 12vw;'><img src='./.plan/images/correct_icon.png' alt='' style='height: inherit; width: 30px; align-items: center;'><p style='color: #fff;'>Atendido</p></button>";

			$divElement = '<div id="callDivRequest" style ="display: flex; background-color: #6596b7; width: 100%; border-radius: 0.5em; height: 15vh; padding: 6px; margin-bottom: 15px; justify-content: space-between;">';
			$divElement .= $dynamicRequest;
			$divElement .= '</div>';
			
			$divElements .= '<script>' . $divElement . '</script>';
		}	
	} else { 
		echo '';   
	}
		
	echo $divElements;
	pg_close($dbconn);	
?>

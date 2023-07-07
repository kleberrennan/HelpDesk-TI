<?php
	include('./connection.php');
	header('Content-Type: application/xml');
	header("Cache-Control: no-cache, no-store, must-revalidate");
	header('Pragma: no-cache');
	header('Expires: 0');

	if(!isset($_SESSION)) {
		session_start();
	}
	
	$tbl_name = "sch_iterma.tbl_reason_form";
	$tbl_descp = "sch_iterma.tbl_reason_descp";

	$fetch_query = "SELECT * FROM $tbl_name";
		
	$result_fetch = pg_query($fetch_query);

	$xml = '';
	$xmlString = '';

	if(pg_num_rows($result_fetch) > 0) {
		while($row = pg_fetch_assoc($result_fetch)) {
			$name_sector = $row['name_sector'];
			$time_date = $row['time_date'];
			$reason_request = $row['reason_request'];
			$id_request = $row['id_reason'];
			$owner_request = $row['owner_request'];

			$fetch_query_description = "SELECT reason_descp from {$tbl_descp} where id_reason = (select id_reason from {$tbl_name} where id_reason = {$id_request})";

			$rowdescp = pg_fetch_assoc(pg_query($fetch_query_description));
			$reason_descp = $rowdescp['reason_descp'];

			if(is_null($owner_request)) {
				$owner_request = 'Sem posse';
			} 

			$xmlString .= "
  <data>
	<name-sector>{$name_sector}</name-sector>
	<description-sector>{$reason_descp}</description-sector>
    <id_request>{$id_request}</id_request>
    <owner_request>{$owner_request}</owner_request>
  </data>
  <html><![CDATA[
	<div id='call_{$id_request}'>
		<div id='callDivRequest' class='callDivRequest_{$id_request}'>
				  <p class='sector-content'>Setor: {$name_sector}<br>Razão: {$reason_request}<br>Hora: {$time_date}</p>
				  <div class='read-more-container' id='read-more-container_{$id_request}' onclick='openReadMore(\"$name_sector\", \"$reason_descp\")'>
					<img src='./.plan/images/readMoreIcon.png' alt=''>
					<h3>Leia<br>Mais</h3>
				  </div> 	
				  <div class='wrapper_interaction'>
					<div class='no_author_container'>
					  <img src='./.plan/images/contractIconScaled.png' alt=''>
					  <p id='owner_worker_show_{$id_request}'>{$owner_request}</p>
					</div>
					<div class='button-container-call'>
					  <button onclick='openPopup({$id_request})' id='idOwnerButton' class='withOwnerButton_{$id_request}'>
						<img src='./.plan/images/iconPeople.png' alt=''>
						<p>Posse</p>
					  </button>
						<button type='button' class='buttonSuccess_${id_request} buttonStyleSucess' id='idButton_{$id_request}' onclick='buttonDeleteCall({$id_request})' disabled>
						<img src='./.plan/images/correct_icon.png' alt=''>
						Atendido
					  </button>
					</div>
				  </div>
				</div>
			</div>
	</div>
  ]]></html>
";

		}
	} else {
		$xmlString = '';
	};
	$xmlObject = new SimpleXMLElement("<document>{$xmlString}</document>");
	$xml = $xmlObject->asXML();
	echo $xml;
	pg_close($dbconn);	
?>

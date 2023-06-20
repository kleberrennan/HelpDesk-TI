<?php
include('./connection.php');

$tbl_name = 'sch_iterma.tbl_feedback';

$select_query = "SELECT * FROM $tbl_name";

$select_fetch = pg_query($select_query);

$xmlString = '';
$xml = '';

if(pg_num_rows($select_fetch) > 0) {
	while($row = pg_fetch_assoc($select_fetch)) {
		$id_feedback = $row['id_feedback'];
		$name_sector = $row['name_sector'];
		$feedback_msg = $row['feedback_msg'];
		$timestamp_feedback = $row['feedback_timesent'];

		$xmlString .= "
<data>
	<id_request>{$id_feedback}</id_request>
</data>
<html><![CDATA[
<div id='feedback_container_id_{$id_feedback}' class='feedback-input_box_calls'>
	<div class='feedback-info'>
		<div class='feedback-info-left'>
			<h3>SETOR: {$name_sector}#{$id_feedback} <br>HORA: {$timestamp_feedback}</h3>
		</div>
		<div class='feedback-info-right' onclick='openFeedback({$id_feedback}, \"{$name_sector}\", \"{$feedback_msg}\")'>
			<img src='./.plan/images/readmMoreReason.png' alt=''>
			<h3>Ler</h3>
		</div>
	</div>
</div>
]]>
</html>
";
	}} else {
		$xmlString = '';
	};
	$xmlObject = new SimpleXMLElement("<document>{$xmlString}</document>");
	$xml = $xmlObject->asXML();
	echo $xml;
	pg_close($dbconn);
?>

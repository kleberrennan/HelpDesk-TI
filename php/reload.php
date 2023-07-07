<?php 
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

function sendEvent($eventName) {
	echo "event: $eventName\n";
	echo "data: {}\n\n";
	flush();
}

sendEvent('reload');

ignore_user_abort(true);
set_time_limit(0);
ob_start();

ob_end_flush();

while(true) {
	sleep(1);
}
?>

<?php

$user = 'klebux'; 
$passw = '';
$db = 'db_iterma';
$host = 'localhost';

$mysqli = new mysqli($host, $user, $passw, $db);

if($mysqli->error) {
	echo 'Failed';
	die("Failed to connect to the database: " . $mysqli->error);
}

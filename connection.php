<?php

$user = 'klebux'; 
$passw = '';
$db = 'db_iterma';
$host = 'localhost';

$dbconn = pg_connect("host=$host dbname=$db user=$user password=$passw port=5432")
	or die("Could not connect: " . pg_last_error());

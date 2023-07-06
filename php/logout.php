<?php
	session_start();
	session_destroy();
	echo 'a';
	header('Location: ../index.php');
	exit;
?>

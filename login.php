<?php
include("connection.php");

/*if(isset($_POST['user_name']) || isset($_POST['user_passw'])) { 
	if(strlen($_POST['user_name']) == 0) {
		echo 'Preencha o seu nome!'; 
	} else if(strlen($_POST['user_passw']) == 0) { 
		echo 'Preencha sua senha!';   
	} else { 
		$user_name = $mysqli->real_escape_string($_POST['user_name']);
		$user_passw = $mysqli->real_escape_string($_POST['user_passw']);

		$sql_code_auth = "SELECT * FROM sch_iterma.tbl_sector WHERE name_user=$user_name AND passw_user=$user_passw";	
		$sql_query_auth = $mysqli->query($sql_code_auth) or die("Failed to execute the query: " . $mysqli->error);

		$quantity = $sql_query_auth->num_rows;

		if($quantity == 1) { 
			$tbl_sector = $sql_query_auth->fetch_assoc();
	
			if(!isset($_SESSION)) { 
				session_start();     
			}

			$_SESSION['user_id'] = $tbl_sector['id_sector']; 
			$_SESSION['user_name'] = $tbl_sector['user_name'];

			header("Location: index.php");  
				
		} else { 
			echo "Falha em logar! O nome de usuário ou senha estão errados!";  	 
		}      	
	}   
}  */ 
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>TI: Login</title>
	<link rel="stylesheet" href="./css/style.css">
	<link rel="icon" type="image/x-icon" href="./.plan/images/tiSupport.png">
</head>
<body>
	<script type="text/javascript" src="./js/login_form.js"></script>
	<main>
		<header>
			<div class="logo">
				<a href="./index.php"><img src="./.plan/images/logoBgTransparent.png" alt="Logo do Iterma"/></a>
			</div>
			<div class="user">
				<img src="./.plan/images/logoUserMain.png" alt="Ícone de Usuário" class="logo-user">
				<a href="./login.php">Logue</a>
			</div>
		</header>
		<section class="login-section">
			<div class="icon-login">
				<img src="./.plan/images/loginWriteBook.png" alt="">
			</div>
			<div class="form-input-login">
				<form action="" method="POST">
					<h3>Nome de usuário:</h3>
					<input type="text" id="login_name" name="user_name">
					<h3>Senha:</h3>
					<input type="password" id="login_passw" name="user_passw">
					<div class="button-wrapper">
						<input type="submit" class='login-submit' value='Logar' onclick='login(); return true'>
					</div>
				</form>
			</div>
		</section>
	</main>
</body>
</html>

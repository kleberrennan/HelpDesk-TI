<?php
include("connection.php");

if(isset($_POST['user_name']) || isset($_POST['user_passw'])) { 
	if(strlen($_POST['user_name']) == 0) {
		echo 'Preencha o seu nome!'; 
	} else if(strlen($_POST['user_passw']) == 0) { 
		echo 'Preencha sua senha!';   
	} else { 
		$user_name = pg_escape_string($_POST['user_name']);  
		$user_passw = pg_escape_string($_POST['user_passw']);  

		if($_POST['user_name'] == "Suporte") { 
			$sql_query = "SELECT * FROM sch_iterma.tbl_user_admin WHERE id_user_admin=1";
			$isAdmin = true;
		} else {
			$sql_query = "SELECT * FROM sch_iterma.tbl_sector WHERE name_user='$user_name' AND passw_user='$user_passw'";
		}
		$sql_result = pg_query($sql_query) or die("Failed to execute the query: " . pg_last_error());

		$quantity = pg_num_rows($sql_result);

		if($quantity == 1) { 
			$tbl_sector = pg_fetch_array($sql_result, null, PGSQL_ASSOC);
	
			if(!isset($_SESSION)) { 
				session_start();     
			}

			if($isAdmin) {
				$_SESSION['user_id'] = $tbl_sector['id_user_admin'];
				$_SESSION['user_name'] = $tbl_sector['name_user_admin'];	

				header("Location: ../admin_panel.php");
			} else {
				$_SESSION['user_id'] = $tbl_sector['id_sector']; 
				$_SESSION['user_name'] = $tbl_sector['name_user'];

				header("Location: ../index.php");
			}	
				
		} else { 
			echo "Falha em logar! O nome de usuário ou senha estão errados!";  	 
		}    	
	}   
} 
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>TI: Login</title>
	<link rel="stylesheet" href="../css/style.css">
	<link rel="icon" type="image/x-icon" href="../.plan/images/tiSupport.png">
</head>
<body>
	<main>
		<header>
			<div class="logo">
				<a href="./index.php"><img src="../.plan/images/logoBgTransparent.png" alt="Logo do Iterma"/></a>
			</div>
			<div class="user">
				<img src="../.plan/images/logoUserMain.png" alt="Ícone de Usuário" class="logo-user">
				<?php
				if(isset($_SESSION['user_name'])) { 
					echo '<a href="index.php" class="user_link">' . $_SESSION["user_name"] . '</a>'; 
				} else {
					echo '<a href="./login.php" class="user_link" id="loginAcc">Logue</a>';		
				}
				?>
			</div>
		</header>
		<section class="login-section">
			<div class="icon-login">
				<img src="../.plan/images/loginWriteBook.png" alt="">
			</div>
			<div class="form-input-login">
				<form action="" method="POST">
					<h3>Nome de usuário:</h3>
					<input type="text" id="login_name" name="user_name">
					<h3>Senha:</h3>
					<input type="password" id="login_passw" name="user_passw">
					<div class="button-wrapper">
						<input type="submit" class='login-submit' value='Logar'>
					</div>
				</form>
			</div>
		</section>
	</main>
</body>
</html>

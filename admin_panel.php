<?php
	include('./connection.php');

	if(!isset($_SESSION)) { 
		session_start();
	}
	$tbl_name = "sch_iterma.tbl_reason_form";

	$fetch_query = "SELECT * FROM $tbl_name";
	
	$result_fetch = pg_query($fetch_query);
	if(pg_num_rows($result_fetch) > 0) { 
		while($row = pg_fetch_assoc($result_fetch)) {
			foreach($row_fetched as $key => $value) { 
				echo "$key: $value<br>";   
			}  	  
			$name_sector = $row['name_sector'];
			$time_date = $row['time_date'];
			$reason_request = $row['reason_request'];

			$dynamicRequest = "<p style='font-size: 1.4em; text-transform: uppercase; letter-spacing: 1px; line-height: 1.3em; color: #fff; position: relative; font-weight: 500;'>Setor: $name_sector<br>Razão: $reason_request<br>Hora: $time_date</p>";

			$divElement = '<div style ="display: flex; background-color: #6596b7; width: 100%; border-radius: 0.5em; height: 15vh; padding: 6px; margin-bottom: 15px;">';
			$divElement .= $dynamicRequest;
			$divElement .= '</div>';
			
			$divElements .= $divElement;
		}	
	} else { 
		echo '';   
	}  
   pg_close($dbconn);	
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">	
	<title>Painel de Suporte</title>
	<link rel="stylesheet" href="./css/style.css">
	<link rel="icon" type="image/x-icon" href="./.plan/images/tiSupport.png">
</head>
<body>
	<main>
		<header>
			<div class="logo">
				<a href="./index.php"><img src="./.plan/images/logoBgTransparent.png" alt="Logo do Iterma"/></a>
			</div>
			<div class="user" id="userAccount">
			<div class="iconsUser">	
					<img src="./.plan/images/notificationIcon.png" alt="" class="notification-icon">
					<img src="./.plan/images/logoUserMain.png" alt="Ícone de Usuário" class="logo-user">
				</div>
				<div id="userAccDropdown">
					<?php
					if(isset($_SESSION['user_name'])) { 
						echo '<div class="container-user">';
						echo '<a href="#" class="user_link" id="userDropdown">' . $_SESSION["user_name"] . '</a>';
						echo '</div>';
					} else {
						echo '<a href="./login.php" class="user_link"> Logue </a>';
					}
?>
					<div class="dropdown_menu" id="dropdown_menu_user">
						<a href="./logout.php">Deslogar</a>
						<a id="isAdminPanel" href="./admin_panel.php">Painel</a>
					</div>
				</div>
			</div>
		</header>

		<section class="panel-admin">
			<div class="panel-box-left">
				<h2>Painel</h2>
				<div class="call-section">
					<img src=".plan/images/call-open.png" alt="">
					<h3>Chamados</h3>
				</div>
			</div>
			<div class="panel-box-right">
				<div class="receiver-call-content">
					<img src="./.plan/images/note_icon.png" alt="">
					<h2>Chamados Recebidos</h2>
				</div>
				<div class="box-input-call" id="input-call-info">
					<?php echo $divElements?>
				</div>
			</div>
		</section>
	</main>
	<script>
		var sessionUser = '<?php echo $user_session; ?>';

		const userAcc = document.getElementById('userAccDropdown');
		const dropdown_menu_user = document.getElementById('dropdown_menu_user');
		const dropdown_menu_admin = document.getElementById('isAdminPanel');

		userAcc.addEventListener('mouseover', function() {
			dropdown_menu_user.style.display = 'flex';
			dropdown_menu_admin.style.display = 'flex';
			console.log('Test');
			dropdown_menu_user.style.transform = "translate(10px, 0px)";
		});

		userAcc.addEventListener('mouseout', function() { 
			dropdown_menu_user.style.display = 'none';
		}); 
	</script>
	<!-- <script src='./js/index_button.js'></script> -->
</body>
</html>

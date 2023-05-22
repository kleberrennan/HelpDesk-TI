<?php
	if(!isset($_SESSION)) {
		session_start();
		$user_session = $_SESSION["user_name"];	
		$error_already_exists = $_SESSION["error_already_exists"];
	};
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">	
	<title>Suporte de TI</title>
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
		<section class="content-page">
			<div class="support-ti-image">
				<img src="./.plan/images/tiSupport.png" alt="">
			</div>
			<div class="support-ti-description">
				<h2>Suporte de TI</h2>
				<p>Faça o seu chamado apenas clicando abaixo!</p>
			</div>
			<div class="separator"></div>
			<div class="reason-button">
				<h2>Motivo da Chamada</h2>
				<select id="reasons_call" name="">
					<option disabled selected value='ChooseOption' id="selectReasonFirst">Escolha um motivo!</option>
					<option value="NoInternet">Sem Internet</option>
					<option value="OFFComputer">Computador não liga</option>
					<option value="NOPrint">Sem Imprimir</option>
					<option value="stuckPC">Computador Travado</option>
					<option value="OFFMonitor">Monitor Desligado</option>
					<option value="NOTonerPrint">Impressora sem toner</option>
					<option value="OTHERReasons">Outros Motivos</option>
				</select>
			</div>
			</div>
			<div>
				<div id="error_no_reason">
					<img src="./.plan/images/cautionIcon.png" alt="">
					<p>Precisa escolher um motivo!</p>
				</div>
				<div id="error_no_login">
					<img src="./.plan/images/cautionIcon.png" alt="">
					<p>Você precisa fazer login!</p>
				</div>
				<div id="error_already_exists">
					<img src="./.plan/images/cautionIcon.png" alt="">
					<p>Você precisa esperar liberar o seu pedido!</p>
				</div>
				<div id="error_isAdmin">
					<img src="./.plan/images/cautionIcon.png" alt="">
					<p>Suporte não pode abrir CHAMADO!</p>
				</div>
				<button class="call-support-ti" type="button" id="submit_button">
					<img src="./.plan/images/dialogueBox.png" alt="">
					<p>Chamar</p>
				</button>
			</div>
		</section>
	</main>
	<script>
		var sessionUser = '<?php echo $user_session; ?>';
	</script>
	<script src='./js/index_button.js' type="text/javascript"></script>
</body>
</html>

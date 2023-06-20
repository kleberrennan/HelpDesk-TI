<?php
	include('./connection.php');
	
	if(!isset($_SESSION)) { 
		session_start();
		$user_session = $_SESSION["user_name"];
		if(!isset($user_session)) {
			header('Location: index.php');	
		}	
	} 
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">	
	<title>Painel de Suporte</title>
	<link rel="stylesheet" href="./css/style.css">
	<link rel="icon" type="image/x-icon" href="./.plan/images/tiSupport.png">
	<script src="./js/external/jquery.js"></script>
</head>
<body>
	<div class="notify-alert-box">
		<img src="./.plan/images/tiSupport.png" alt="">
		<p>Deseja receber notificações?</p>
		<div class="buttons-notifications">
			<button id="notify-cancel-button">Cancelar</button>
			<button id="notify-allow-button">Permitir</button>
		</div>	
	</div>
	<div id="popUpFeedbackContainer">
	</div>
	<div id="popUpReadMoreButton">
		<header class="bar_readMore_button">
			<img src="./.plan/images/xIcon.png" alt="" id="closePopUpReadMore"/>
		</header>	
		<div class="read-more-container-popUp">
			<h2>${name_sector}</h2>
			<p>${content_descp_more}</p>
		</div>
	</div>
	<div id="popUpOwnerButton">
	</div>
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
				<div class="call-section" id="call-section-box">
					<img src=".plan/images/call-open.png" alt="">
					<h3>Chamados</h3>
				</div>
				<div class="feedback-section" id="feedback-section-box" style='background-color: transparent;'>
					<img src="./css/images/feedbackIcon.png" alt="">
					<h3>Feedback</h3>
				</div>
			</div>
			<div class="panel-box-right" id="panel-box-right-content">
				<div id="panelBoxInputCall">
					<div class="receiver-call-content">
						<img src="./.plan/images/note_icon.png" alt="">
						<h2>Chamados Recebidos</h2>
					</div>
					<div class="box-input-call" id="input-call-info">
					</div>
				</div>
				<div id="panelBoxFeedback">
					<div class="feedback-title">
						<img class='feedback-received' src="./.plan/images/silenceEmojiWhite.png" alt="">
						<h2>Feedbacks Recebidos</h2>
					</div>
					<div id="feedback-call-input" class="box-feedback-input">
					</div>
				</div>
			</div>
		</section>
	</main>
	<script>var sessionUser = '<?php echo $user_session; ?>';</script>
	<script src='./js/admin_panel.js'></script>
	<script src='./js/notification_system.js'></script>
	<script src='./js/update_container.js'></script>
	<script src='./js/change_button_admin_panel.js'></script>
</body>
</html>

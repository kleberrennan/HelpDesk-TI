<?php
	if(!isset($_SESSION)) {
		error_reporting(0);
		session_start();
		$user_session = $_SESSION["user_name"];	
		$cookieLifetime = 7200;
		$sessionLifetime = 7200;
		session_set_cookie_params($cookieLifetime);
		ini_set('session.gc_maxlifetime', $sessionLifetime);
	};
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">	
	<title>Suporte de TI</title>
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
	<main>
		<header>
			<div class="logo">
				<a href="./index.php"><img src="./.plan/images/logoBgTransparent.png" alt="Logo do Iterma"/></a>
			</div>
		<div class="user" id="userAccount">
				<div class="iconsUser">	
					<img src="./.plan/images/notificationIcon.png" alt="" id="notification-icon">
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
		<section class="selectable_box" id="selectable_box_id">
			<div class="box_wrapper_upper">
				<img src="./.plan/images/arrowIcon.png" alt="" id="arrow_select_box_left">
				<p id="option01_menu">Feedback</p>
				<p id="option02_feedback">Fale Conosco</p>
				<img src="./.plan/images/arrowIcon.png" alt="" id="arrow_select_box_right">
			</div>
		</section>
		<section class="content-page" id="support_ti_view">
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
					<option value="SnackOpt">Convida a gente para o lanche :)</option>
					<option value="DifficultSEI">Dificuldades com o SEI-MA</option>
					<option value="OTHERReasons">Outros Motivos</option>
				</select>
			</div>
			<div id="separator_box_other_reasons"></div>
			<div id="reason_descp_other_reasons" class="reason_other_wrapper">
				<img src="./.plan/images/writeIcon.png" alt="">
				<input type="text" minlength="10" maxlength="500" placeholder="Digite algo mais..." required id="input_more_descp_reason"/>
			</div>
			</div>
			<div id="status_request">
				<div id="success_request">
					<img src="./.plan/images/sucessIcon.png"  alt="">
					<p>Pedido efetuado com sucesso!</p>
				</div>
				<div id="success_feedback">
					<img src="./.plan/images/sucessIcon.png" alt="">
					<p>Feedback efetuado com sucesso!</p>
				</div>
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
				<div id="error_noContentOnInput">
					<img src="./.plan/images/cautionIcon.png" alt="">
					<p>Você precisa informar o motivo na caixa!</p>
				</div>
				<div id="error_noFeedbackMsg">
					<img src="./.plan/images/cautionIcon.png" alt="">
					<p>Você precisa informar o seu feedback!</p>
				</div>
				<button class="call-support-ti" type="button" id="submit_button">
					<img src="./.plan/images/dialogueBox.png" alt="">
					<p>Chamar</p>
				</button>
			</div>
		</section>
		<div class="separator-wrapper_box" id="separator-wrapper_box_unique_id">
			<div class="separator_box"></div>
		</div>	
		<section class="message_box_section" id='messageBoxID'>
			<div class="header_box" id="header_box">
				<img src="./.plan/images/silenceEmoji.png" alt="" id="silenceEmojiAnimation">
				<h2>Quer dizer algo para a gente?<br>Ficará no sigilo</h2>   
				<div class="input_box">
					<input type="text" id="input_text_silence" minlength="5" maxlength="500" placeholder="Digite aqui" disabled/>
					<img src="./.plan/images/send_message_button.png" alt="" id='sendInputBox'>
				</div>
			</div>
		</section>
		<section class="notification-worker-sent" id="notific-worker-section">
			<div class="title-notification" id="title-notific">
				<img src="./.plan/images/sucessIcon.png" alt="">
				<h2>Alguém atendeu!</h2>
			</div>
			<div class="worker-box-notification" id="worker-box-notific">
				<img src="./.plan/images/toolIconAccepted.png" alt="">
				<p class="worker-notification-content" id="worker-notific-content"></p>
			</div>
		</section>
	</main>
	<script>
		var sessionUser = '<?php echo $user_session; ?>';
	</script>
	<script src='./js/index_button.js' type="text/javascript"></script>
	<script src='./js/notification_system.js' type='text/javascript'></script>
	<script src='./js/index_select_box.js'></script>
	<script src='./js/update-index-worker.js'></script>
	<script src='./js/input_box_message.js'></script>
</body>
</html>

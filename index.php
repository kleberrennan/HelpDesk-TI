<?php
	if(!isset($_SESSION)) {
		session_start();
	};
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
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
			<div class="user">
				<img src="./.plan/images/logoUserMain.png" alt="Ícone de Usuário" class="logo-user">
				<?php
				if(isset($_SESSION['user_name'])) { 
					echo '<a href="login.php">' . $_SESSION["user_name"] . '</a>'; 
				} else {
					echo '<a href="./login.php">Logue</a>';		
				}
				?>
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
				<button class="call-support-ti" type="button" id="submit_button" disabled>
					<img src="./.plan/images/dialogueBox.png" alt="">
					<p>Chamar</p>
				</button>
			</div>
		</section>
	</main>
	<script src='./js/index_button.js'></script>
</body>
</html>

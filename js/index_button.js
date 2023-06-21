const reasonCallSelect = document.getElementById('reasons_call');
const submit_button = document.getElementById('submit_button');
const userAcc = document.getElementById('userAccDropdown');
const error_div = document.getElementById('error_no_reason');
const error_no_login = document.getElementById('error_no_login');
const loginAcc = document.getElementById('loginAcc');
const dropdown_menu_user = document.getElementById('dropdown_menu_user');
const dropdown_menu_admin = document.getElementById('isAdminPanel');
const silenceEmojiAnimation = document.getElementById('silenceEmojiAnimation');
const noContentOnInput = document.getElementById('error_noContentOnInput');
const already_exists = document.getElementById('error_already_exists');

const separator_box_other_reason = document.getElementById('separator_box_other_reasons');
const reason_descp_other_reason = document.getElementById('reason_descp_other_reasons');

silenceEmojiAnimation.addEventListener('click', function() {
	silenceEmojiAnimation.classList.add('silenceEmoji-animation');
});

userAcc.addEventListener('mouseover', function() {
	if(sessionUser.includes('Suporte')) { 
		dropdown_menu_admin.style.display = 'flex';
		dropdown_menu_user.style.display = 'flex';
		dropdown_menu_user.style.transform = "translate(0px, 0px)";
	} else {
		dropdown_menu_user.style.display = 'flex';
		dropdown_menu_user.style.transform = "translate(0px, 0px)";
		dropdown_menu_admin.style.display = 'none';
	}

	if(userAcc.textContent.includes('Logue')) { 
		dropdown_menu_user.style.display = 'none';
	}  
});

userAcc.addEventListener('mouseout', function() { 
	dropdown_menu_user.style.display = 'none';	
});  

function create_request_call() { 
	const date = new Date();
	var box_input_call = document.createElement('div');

	box_input_call.className = 'call-sector';

	var paragraph_content = document.createElement('p');						

	paragraph_content.textContent = `Setor: ${sessionUser}<br>Motivo: ${reasonCallSelect.options[reasonCallSelect.selectedIndex].textContent}<br>Hora: ${date.getFullYear()}:${date.getMonth()}:${date.getDay()}`;

	box_input_call.appendChild(paragraph_content);

	var existingData = localStorage.getItem('createdRequest');
	var dataArr = existingData ? JSON.parse(existingData) : [];
	var indexData = dataArr.length;

	var serializedElement = { 
		className: box_input_call.className,
		content: paragraph_content.textContent,
		index: indexData,
	};

	dataArr.push(serializedElement);	
	localStorage.setItem('createdRequest', JSON.stringify(dataArr));
}; 

function store_call_button() {	
	const xhr = new XMLHttpRequest();

	xhr.open('POST', '../store_call_button.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
	xhr.onload = function () {
		if(xhr.status == 200) {
			var response_data = xhr.responseText;
			if (response_data.includes('ExistsRow') === true) {
				success_request.style.display = 'none';
				already_exists.style.display = 'flex';
			} else if(response_data.includes('NoExists') === true) {
				success_request.style.display = 'flex';
				already_exists.style.display = 'none';
				if(reasonCallSelect.value == 'OTHERReasons')	{
					var descp_reason = input_more_descp_reason.value;

					$.ajax({
						url: '../special_reason_other.php',
						method: 'POST',
						data: {
							data_descp: descp_reason,
							name_sector: sessionUser,
						},
						success: function(response) {
							console.log(response);
						}, 
						error: function(error, xhr, status) {
							console.log(error, xhr, status);
						},
					});

				} else {
					$.ajax({
						url: 'send_notification.php',
						method: 'POST',
						data: {
							title: "PEDIDO NOVO",
							notification: "Um novo pedido foi recebido!",
							recipient: 'Suporte'
						},
						success: function(response) {
							console.log(response);
						},
						error: function(xhr, status, error) {
							console.log(xhr, status, error);
						}
					})
				}
		} else { 
				console.log("Error Storing call data!");
		}
	};
};
	xhr.send(`user_name=${encodeURIComponent(sessionUser)}&reason=${encodeURIComponent(reasonCallSelect.options[reasonCallSelect.selectedIndex].textContent)}`);
};

submit_button.addEventListener('click', function() {
	const error_isAdmin = document.getElementById('error_isAdmin');
	const inputDescpReason = document.getElementById('input_more_descp_reason');
	const success_request = document.getElementById('success_request');

	var reason_message_initial = reasonCallSelect.value;

	if(reason_message_initial == 'ChooseOption' && sessionUser != 'Suporte') {	
		error_div.style.display = 'flex';
	} else if(sessionUser == 'Suporte') {
		error_isAdmin.style.display = 'flex';
	} else {	
		error_div.style.display = 'none';
		error_isAdmin.style.display = 'none';
		if(sessionUser.length === 0) { 
			error_no_login.style.display = 'flex';
			success_request.style.display = 'none';
		} else {
			const otherReason = 'Outros Motivos';
			var selectedCall = reasonCallSelect.options[reasonCallSelect.selectedIndex].textContent;

			if(selectedCall == otherReason) {
				if(inputDescpReason.value === '') {
					noContentOnInput.style.display = 'flex';
				} else {
					store_call_button();
				} 
			}
			if(selectedCall !== otherReason) {
				noContentOnInput.style.display = 'none'; 
				store_call_button();
			}
		}  
	}
});  
reasonCallSelect.addEventListener('change', function() {
	const other_reason = 'OTHERReasons';	
	var reason_message_initial = reasonCallSelect.value;

	if(reason_message_initial == 'ChooseOption') {
		submit_button.classList.remove('disabled');
		error_div.style.display = 'none';
		separator_box_other_reason.style.display = 'none';
		reason_descp_other_reason.style.display = 'none';
	} else {
		noContentOnInput.style.display = 'none';
		submit_button.classList.add('disabled');
	}; 
	
	if(sessionUser.length > 0) {
		if(reason_message_initial == other_reason) {
			separator_box_other_reason.style.display = 'block';
			reason_descp_other_reason.style.display = 'flex';
		} else {
			separator_box_other_reason.style.display = 'none';
			reason_descp_other_reason.style.display = 'none';
		};
	};
});

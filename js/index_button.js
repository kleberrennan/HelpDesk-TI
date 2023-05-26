const reasonCallSelect = document.getElementById('reasons_call');
const submit_button = document.getElementById('submit_button');
const userAcc = document.getElementById('userAccDropdown');
const error_div = document.getElementById('error_no_reason');
const error_no_login = document.getElementById('error_no_login');
const loginAcc = document.getElementById('loginAcc');
const dropdown_menu_user = document.getElementById('dropdown_menu_user');
const dropdown_menu_admin = document.getElementById('isAdminPanel');

userAcc.addEventListener('mouseover', function() {
	if(sessionUser.includes('Suporte')) { 
		dropdown_menu_admin.style.display = 'flex';
		dropdown_menu_user.style.display = 'flex';
		dropdown_menu_user.style.transform = "translate(0px, 0px)";
		console.log('c');
	} else {
		dropdown_menu_user.style.display = 'flex';
		dropdown_menu_user.style.transform = "translate(0px, 0px)";
		dropdown_menu_admin.style.display = 'none';
		console.log('b');
	}

	//dropdown_menu_user.style.transform = 'translate(-50px, 90px)';

	if(userAcc.textContent.includes('Logue')) { 
		dropdown_menu_user.style.display = 'none';
	}  
});

userAcc.addEventListener('mouseout', function() { 
	dropdown_menu_user.style.display = 'none';	
})  

function create_request_call() { 
	const date = new Date();
	var box_input_call = document.createElement('div');

	box_input_call.className = 'call-sector';

	var paragraph_content = document.createElement('p');						

	paragraph_content.textContent = `Setor: ${sessionUser}<br>Motivo: ${reasonCallSelect.options[reasonCallSelect.selectedIndex].textContent}<br>Hora: ${date.getFullYear()}:${date.getMonth()}:${date.getDay()}`;

	box_input_call.appendChild(paragraph_content);

	console.log(`Sector: ${sessionUser} Reason: ${reasonCallSelect.options[reasonCallSelect.selectedIndex].textContent}`);
	var existingData = localStorage.getItem('createdRequest');
	var dataArr = existingData ? JSON.parse(existingData) : [];
	var indexData = dataArr.length;

	var serializedElement = { 
		className: box_input_call.className,
		content: paragraph_content.textContent,
		index: indexData,
	};

	dataArr.push(serializedElement);	
	console.log(dataArr);
	console.log(serializedElement);
	localStorage.setItem('createdRequest', JSON.stringify(dataArr));
}  

if(window.location.href == 'https://localhost/admin_panel.php') {
	console.log('TestADMIN');
	loadRequestCall();
};
console.log(window.location.href);
submit_button.addEventListener('click', function() {
	var reason_message_initial = reasonCallSelect.value;
	const success_request = document.getElementById('success_request');
	const already_exists = document.getElementById('error_already_exists');

	
	if(reason_message_initial == 'ChooseOption' && sessionUser != 'Suporte') {	
		error_div.style.display = 'flex';
	} else if(sessionUser == 'Suporte') {
		const error_isAdmin = document.getElementById('error_isAdmin');
		error_isAdmin.style.display = 'flex';
	} else {	
		error_div.style.display = 'none';
		error_isAdmin.style.display = 'none';
		if(sessionUser.length === 0) { 
			error_no_login.style.display = 'flex';
			success_request.style.display = 'none'; 
		} else {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', '../store_call_button.php', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
			xhr.onload = function () {
				if(xhr.status == 200) {
					var response_data = xhr.responseText;
					if (response_data.includes('ExistsRow') === true) {
						success_request.style.display = 'none';
						already_exists.style.display = 'flex';
					} else if(response_data.includes('NoExists') === true){
						success_request.style.display = 'flex';
						already_exists.style.display = 'none';
							
					}
				} else { 
					console.log("Error Storing call data!");
				}
			};
			xhr.send(`user_name=${encodeURIComponent(sessionUser)}&reason=${encodeURIComponent(reasonCallSelect.options[reasonCallSelect.selectedIndex].textContent)}`);


		}  
	}
});  

reasonCallSelect.addEventListener('change', function() { 
	var reason_message_initial = reasonCallSelect.value;
	if(reason_message_initial == 'ChooseOption') {
		submit_button.classList.remove('disabled');
		error_div.style.display = 'none';
	} else {
		submit_button.classList.add('disabled');
	}  
})

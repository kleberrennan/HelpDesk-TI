var sessionUser = '<?php echo $user_session; ?>';

const userAcc = document.getElementById('userAccDropdown');
const dropdown_menu_user = document.getElementById('dropdown_menu_user');
const dropdown_menu_admin = document.getElementById('isAdminPanel');
var xhrRequest = new XMLHttpRequest();

function buttonDeleteCall(id_request) {
	console.log(`buttonDelete: ${id_request}`);

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '../delete_request.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() { 
		if (xhr.readyState === 4 && xhr.status === 200) { 
			location.reload();
			console.log(xhr.responseText);
			if(xhr.getResponseHeader('XReload-Page') == 'true'){ 
				location.reload();
			} 
		}; 
	};  

	xhr.send(`id_request=${encodeURIComponent(id_request)}`);
}
userAcc.addEventListener('mouseover', function() {
	dropdown_menu_user.style.display = 'flex';
	dropdown_menu_admin.style.display = 'flex';
	console.log('Test');
	dropdown_menu_user.style.transform = "translate(10px, 0px)";
});

userAcc.addEventListener('mouseout', function() { 
	dropdown_menu_user.style.display = 'none';
});



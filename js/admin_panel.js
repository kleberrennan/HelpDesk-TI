var sessionUser = '<?php echo $user_session; ?>';

const userAcc = document.getElementById('userAccDropdown');
const dropdown_menu_user = document.getElementById('dropdown_menu_user');
const dropdown_menu_admin = document.getElementById('isAdminPanel');
var xhrRequest = new XMLHttpRequest();


userAcc.addEventListener('mouseover', function() {
	dropdown_menu_user.style.display = 'flex';
	dropdown_menu_admin.style.display = 'flex';
	console.log('Test');
	dropdown_menu_user.style.transform = "translate(10px, 0px)";
});

userAcc.addEventListener('mouseout', function() { 
	dropdown_menu_user.style.display = 'none';
});



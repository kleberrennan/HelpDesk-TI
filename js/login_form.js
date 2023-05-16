function login() { 
	var user_name = document.getElementById('login_name').value;
	var user_passw = document.getElementById('login_passw').value;

	if(user_name == 'admin' && user_passw == 'admin') { 
		alert('Admin!');
		location.href='../index.html';
	} else { 
		alert('Incorretos');
	}   
}  

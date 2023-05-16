const reasonCallSelect = document.getElementById('reasons_call');
const submit_button = document.getElementById('submit_button');
const error_div = document.getElementById('error_no_reason');


submit_button.addEventListener('click', function() {
	var reason_message_initial = reasonCallSelect.value;
	
	if(reason_message_initial == 'ChooseOption') {
		error_div.style.display = 'flex';
	} else { 
		error_div.style.display = 'none'; 
	}
});  

reasonCallSelect.addEventListener('change', function() { 
	var reason_message_initial = reasonCallSelect.value;
	if(reason_message_initial == 'ChooseOption') {
		submit_button.classList.remove('disabled');
		error_div.style.display = 'none';
		alert('Alert');
	} else {
		submit_button.classList.add('disabled');
	}  
})

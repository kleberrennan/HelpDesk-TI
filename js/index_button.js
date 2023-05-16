const reasonCallSelect = document.getElementById('reasons_call');
const submit_button = document.getElementById('submit_button');
const error_div = document.getElementById('error_no_reason');

submit_button.addEventListener('click', function() { 
	const select_value_error = reasonCallSelect.value;
	alert('Click');
	if(select_value_error == 'Escolha um motivo') {
		error_div.style.display = 'block';
	}  
});  

reasonCallSelect.addEventListener('change', function() { 
	const selected_value = reasonCallSelect.value;
	submit_button.disabled = selected_value == 'Escolha um motivo';
	if(submit_button) {
		submit_button.classList.add('disabled');
	} else {
		submit_button.classList.remove('disabled');
	}  
})

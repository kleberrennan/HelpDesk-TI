const send_input_box = document.getElementById('sendInputBox');

send_input_box.addEventListener('click', function() {
	const header_box = document.getElementById('header_box');
	const success_feedback = document.getElementById('success_feedback');
	const error_noFeedbackMsg = document.getElementById('error_noFeedbackMsg');
	const input_text = document.getElementById('input_text_silence').value;
	console.log(error_noFeedbackMsg);
	if(input_text.length === 0) {
		if(success_feedback.style.display === 'flex') {
			header_box.removeChild(success_feedback);
		}

		console.log('Digita algo seu corno');
		error_noFeedbackMsg.style.display = 'flex';
		header_box.appendChild(error_noFeedbackMsg);
	} else if(sessionUser === 'Suporte' || sessionUser.length === 0) {
		console.log('Suporte Or User');	
	}
	else {
		if(error_noFeedbackMsg.style.display == 'flex') {
			header_box.removeChild(error_noFeedbackMsg);
		}
		
		header_box.appendChild(success_feedback);

		success_feedback.style.display = 'flex';
		success_feedback.style.color = 'green';

		$.ajax({
			url: '../feedback_sent.php',
			method: 'POST',
			data: {
				name_sector: sessionUser,
				feedback_msg: input_text
			},
			success: function(response) {
				console.log(response);
			},
			error: function(error, status, xhr) {
				console.log(error);
				console.log(status);
				console.log(xhr);
			}
		})
	};
});

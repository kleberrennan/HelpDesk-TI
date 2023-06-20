const call_box = document.getElementById('call-section-box');
const feedback_box = document.getElementById('feedback-section-box');
const panelBoxRight = document.getElementById('panelBoxInputCall');
const panelBoxFeedback = document.getElementById('panelBoxFeedback');
const panelBoxFeedbackTitle = document.querySelector('.feedback-title');
const panelBoxFeedbackBoxInput = document.querySelector('.box-feedback-input');

call_box.addEventListener('click', function() {
	call_box.style.backgroundColor = '#031b2a';
	feedback_box.style.backgroundColor = 'transparent';
	panelBoxRight.style.display = 'block';
	panelBoxFeedbackTitle.style.display = 'none';
	panelBoxFeedbackBoxInput.style.display = 'none';
});

feedback_box.addEventListener('click', function() {
	feedback_box.style.backgroundColor = '#031b2a';
	panelBoxRight.style.display = 'none';
	panelBoxFeedbackTitle.style.display = 'flex';
	panelBoxFeedbackBoxInput.style.display = 'block';
	call_box.style.backgroundColor = 'transparent';
});

const arrow_right = document.getElementById('arrow_select_box_right');
const arrow_left = document.getElementById('arrow_select_box_left');

const ti_support_view = document.getElementById('support_ti_view');
const ti_feedback = document.getElementById('messageBoxID');
const ti_feedback_separator = document.getElementById('separator-wrapper_box_unique_id');

const selectable_box_id = document.getElementById('selectable_box_id');

const option01_menu = document.getElementById('option01_menu');
const option02_feedback = document.getElementById('option02_feedback');

const input_text_silence = document.getElementById('input_text_silence');
const iconSendButton = document.getElementById('sendInputBox');

var ti_view_computed = window.getComputedStyle(ti_support_view);
var ti_feedback_computed = window.getComputedStyle(ti_feedback);

arrow_left.addEventListener('click', function() {
	if(ti_view_computed.display == 'flex') {
		arrow_left.style.animation = 'none';
		void arrow_left.offsetWidth;
		arrow_left.style.animation = "anim_arrow_wrong_left 0.4s forwards";
	} else {
		ti_support_view.style.display = 'flex';
		option01_menu.style.display = 'block';
		option02_feedback.style.display = 'none'
		selectable_box_id.style.marginBottom = '0px';
		ti_feedback_separator.style.display = 'none';
		ti_feedback.style.display = 'none';
	}
});

arrow_right.addEventListener('click', function() {
	if(ti_feedback_computed.display == 'none') {
		ti_support_view.style.display = 'none';
		ti_feedback.style.display = 'flex';
		ti_feedback_separator.style.display = 'flex';
		selectable_box_id.style.marginBottom = '50px';
		option01_menu.style.display = 'none';
		option02_feedback.style.display = 'block';
		if(sessionUser.length != 0) {
			ti_feedback_separator.style.filter = 'blur(0px)';
			ti_feedback.style.filter = 'blur(0px)';
			iconSendButton.style.cursor = 'pointer';
			input_text_silence.disabled = false;
		} else {
			ti_feedback.style.filter = 'blur(5px)';
			ti_feedback_separator.style.filter = 'blur(5px)';
			iconSendButton.style.cursor = 'none';
			input_text_silence.disabled = true;
		}
	} else {
		arrow_right.style.animation = 'none';
		void arrow_right.offsetWidth;
		arrow_right.style.animation = 'anim_arrow_wrong_right 0.4s forwards';
	}
});

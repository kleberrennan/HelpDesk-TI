function updateDivCall() {
	$.ajax({
		url: '../process_request.php',
		method: 'GET',
		dataType: 'text',
		success: function(response) {
			var cleanedString = response.replace(/<script\b[^>]*>|<\/script>/gi, '');	
			$('#input-call-info').html(cleanedString);
		}
	})

}

setInterval(updateDivCall, 1000);

const container_notification = document.querySelector('.notify-alert-box');

if(window.location.href == 'https://localhost/index.php')  {
	const submit_button = document.getElementById('submit_button');
	submit_button.addEventListener('click', function() {
		const status_request = document.querySelector('#status_request');
		var child_container = status_request.querySelector('[id*="error"]');
		var reason_container = status_request.querySelector('[id*=reason]');
		console.log(child_container.style.display);	
		if(child_container.style.display == 'none' && reason_container !== null) {
			$.ajax({
			url: 'send_notification.php',
			method: 'POST',
			data: { notification: 'Um novo pedido foi acionado!', recipient: ''},
			success: function(response) {
				console.log(response);
			}
		});

		}
	})
} else {
	console.log('Suporte');
	if (container_notification) { 
		this.setTimeout(
			container_notification.style.top = '0',
		), 1000;
	
		notifyTrue();
	
		document.querySelector('#notify-allow-button').onclick = async() => {
			localStorage.setItem('notify', 'true');
			container_notification.style.top = '-100%';
			notifyTrue();
			notifyOption();
		}
	
		function notifyTrue() { 
			if(localStorage.getItem('notify', 'true')) { 
				container_notification.style.display = 'none';
			}
		}
		document.querySelector('#notify-cancel-button').onclick = async() => { 
		localStorage.setItem('notify', 'false');
		notifyFalse();
		}

		function notifyFalse() { 
			if(localStorage.getItem('notify', 'false')) { 
				container_notification.style.display = 'none';
				container_notification.style.top = '-100%';
			}  
		}

		function showNotification() { 
			var notificationBody = new Notification('New message for Google', {
				body: 'Google',
			})
		}  

		function notifyOption() { 
			if(localStorage.notify == 'true') { 
				if(Notification.permission == 'granted') { 
			
				} else if(Notification.permission !== 'denied') {
					Notification.requestPermission().then(permission => {
						if(permission == 'granted') { 
							console.log('Notification granted!');
						}  
					})
				}  
			}  
		}
	}
}

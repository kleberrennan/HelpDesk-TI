const container_notification = document.querySelector('.notify-alert-box');

if (container_notification) { 
	this.setTimeout(
			container_notification.style.top = '0',
	), 1000;
}
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
};  

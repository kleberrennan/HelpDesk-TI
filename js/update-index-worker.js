const titleNotif = document.getElementById('title-notific');
const boxWorker = document.getElementById('worker-box-notific');
const workerContent = document.getElementById('worker-notific-content');
const workerSection = document.getElementById('notific-worker-section');

function checkIfOwnerExists() {
	$.ajax({
		url: '../check_owner.php',
		method: 'POST',
		data: {
			nameUser: sessionUser,
		},
		success: function(response) {
			if(response.length === 0 || response == 0) {
				titleNotif.style.display = 'none';
				workerSection.style.display = 'none';
				boxWorker.style.display = 'none';
			} else {
				console.log(response);
				workerSection.style.display = 'flex';
				titleNotif.style.display = 'flex';
				boxWorker.style.display = 'flex';
				workerContent.textContent = response + ' a caminho';
			}
		},
		error: function(xhr, status, error) {
			console.log(xhr, status, error);
		},
	})
};

if(sessionUser.length === 0 || sessionUser == 'Suporte') { 
	console.log('noUser or Suporte'); 
} else {
	setInterval(checkIfOwnerExists, 300);
}

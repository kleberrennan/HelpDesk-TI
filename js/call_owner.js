const mainButton = document.getElementById('idButton');

const inputCall = document.querySelector('#input-call-info');

console.log(inputCall.firstElementChild);

if(callDivRequest != null) {
	const ownerButton = inputCall.querySelector('#idOwnerButton');
	const closeButton = inputCall.querySelector('#closePopUpOwner');
	const workerShow = inputCall.querySelector('#owner_worker_show');
	
	var listWorkers = document.querySelectorAll('#list_workers_unordered li');
	console.log('ownerButton: ', ownerButton);
	function clickWorkerHandle() {
		clickedButton = this;
		workerShow.innerHTML = clickedButton.textContent;
		popUpOwnerButton.style.display = 'none';
		mainButton.disabled = false;
		mainButton.style.filter = 'blur(0px)';
		ownerButton.style.filter = 'blur(2px)';
		ownerButton.disabled = true;
		console.log("Button Clicked: ", clickedButton.textContent);
	}

	for (var count = 0; count < listWorkers.length; count++) {
			listWorkers[count].addEventListener('click', clickWorkerHandle);
	}

	ownerButton.addEventListener('click', function() {
			popUpOwnerButton.style.display = 'block';
	});

	closeButton.addEventListener('click', function() {
			popUpOwnerButton.style.display = 'none';
	});
}

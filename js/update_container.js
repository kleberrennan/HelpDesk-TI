var xhr = new XMLHttpRequest();

var currentContainer = document.getElementById('input-call-info');

var counter = 0;
var isDeleted = false;
var lastButton = 0;

const popUp = document.getElementById('popUpOwnerButton');
const feedback_box_section = document.getElementById('feedback-section-box');

function changeStatusCall(containerId) {
		var element_class = document.querySelector('.withOwnerButton_' + containerId);
		var element_id = document.querySelector('#idButton_' + containerId);

		element_class.style.filter = 'blur(2px)';
		element_class.style.cursor = 'none';
		element_class.disabled = true;
		element_id.style.filter = 'blur(0px)';
		element_id.disabled = false;
		element_id.style.cursor = 'pointer';
}

function changeOwnerBox(button_id, name_worker) {
	$.ajax({
		url: "../owner_switch_call.php",
		method: "POST",
		data: {
			name_worker: name_worker,
			button_id: button_id,
		},
		success: function(response) {
			$('#owner_worker_show_' + button_id).html(response);
			popUp.style.display = 'none';
			changeStatusCall(button_id);
		},
		error: function(xhr, error, status) {
			console.log(xhr + error + status);
		}
	})

}

const popUpReadMore = document.getElementById('popUpReadMoreButton');

function openReadMore(name_sector, reason_descp) {
	$.ajax({
		url: "../data/popUpReadMore.xml",
		dataType: "xml",
		success: function(data) {
			var cssRulesReadMore = $(data).find("css").text();

			$("<style>").text(cssRulesReadMore).appendTo("head");

			var HTMLContentReadMore = $(data).find("div").html();
			$("#popUpReadMoreButton").html(HTMLContentReadMore);
			console.log(HTMLContentReadMore);
			$('#name_sector_read_more').html(name_sector);
			$('#paragraph_sector_content').html(reason_descp);
			const closeReadMoreButton = document.querySelector('#closePopUpReadMore');

			closeReadMoreButton.addEventListener('click', function() {
				popUpReadMore.style.display = 'none';
			});

			popUpReadMore.style.display = "flex";
		},
		error: function(xhr, error, status) {
			console.log(xhr, status, error);
		}
	});
}

const feedback_container = document.getElementById('feedback-call-input');

function openFeedback(id_request, name_sector, feedback_content) {
	console.log('openFeedClick');
	$.ajax({
		url: "../data/popUpFeedback.xml",
		dataType: "xml",
		success: function(data) {
			var htmlContent = $(data).find("div").html();

			$('#popUpFeedbackContainer').html(htmlContent);

			const popUpFeedbackContainer = document.getElementById('popUpFeedbackContainer');
			const closeFeedbackIcon = document.getElementById('close_feedback_icon');

			closeFeedbackIcon.addEventListener('click', function() {
				popUpFeedbackContainer.style.display = 'none';
			});
			const title_feedback = document.getElementById('title_feedback_popUp');

			title_feedback.innerHTML = name_sector + "#" + id_request;

			const descp_feedback = document.getElementById('content_feedback_popUp');

			descp_feedback.innerHTML = feedback_content;

			popUpFeedbackContainer.style.display = 'block';
		}
	})
}

function openPopup(button_id) {
	$.ajax({
		url: "../data/popUpOwner.xml",
		dataType: "xml",
		success: function(data) {
			var cssRules = $(data).find("css").text();

			$("<style>").text(cssRules).appendTo("head");

			var htmlContent = $(data).find("div").html();
			$('#popUpOwnerButton').html(htmlContent);

			const closeButton = document.querySelector('#closePopUpOwner');

			closeButton.addEventListener('click', function() {
				popUpOwnerButton.style.display = 'none';
			});

			const list_workers = document.getElementById('list_workers_unordered');

			const list_workers_li = list_workers.querySelectorAll('#list_workers_unordered li');
			
			for(let count = 0; count < list_workers_li.length; count ++) {
				list_workers_li[count].addEventListener('click', function() {
					changeOwnerBox(button_id, list_workers_li[count].textContent);
				});
			}
			popUp.style.display = 'block';
		},
		error: function(xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
}

/*Close With X Button The Owner Menu*/
function buttonDeleteCall(id_request) {
	xhr.open('POST', '../delete_request.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() { 
		if (xhr.readyState === 4 && xhr.status === 200) { 
			location.reload();
			if(xhr.getResponseHeader('XReload-Page') == 'true'){ 
				location.reload();
			} 
		}; 
	};  

	xhr.send(`id_request=${encodeURIComponent(id_request)}`);
	isDeleted = true;
	lastButton = id_request;
}

const input_call = document.querySelectorAll('#input_call_info');
var isStored = [];

function getNumber(str) {
	var regexNum = /\d+/;

	var matches = str.match(regexNum);

	if(matches && matches.length > 0) {
		return matches[0];
	}

	return null;
}

var idDataFeedback = [];
function updateDivCall() {
	if(feedback_box_section.style.backgroundColor !== 'transparent') {
		$.ajax({
			url: '../feedback_received.php',
			method: 'GET',
			dataType: 'xml',
			success: function(response) {
				var isEmptyResponseFB = response.documentElement.textContent.trim();

				if(response === null || isEmptyResponseFB === '') {
					idDataFeedback = [];
					console.log('emptyDiv');
				} else {
					var xmlStringFeedback = new XMLSerializer().serializeToString(response);
					var parserFB = new DOMParser();
					var xmlDoc = parserFB.parseFromString(xmlStringFeedback, 'text/xml');

				
					var id_requestData = xmlDoc.querySelectorAll('data');

					for(let countToCheckFB = 0; countToCheckFB < id_requestData.length; countToCheckFB++) {
						let idToCheckFB = id_requestData[countToCheckFB].querySelector('id_request').textContent;
						if(!idDataFeedback.includes(idToCheckFB)) {
							var bodyElement = xmlDoc.querySelectorAll('html');
							$('#feedback-call-input').append(bodyElement[countToCheckFB].textContent);
						
							idDataFeedback.push(idToCheckFB);
						}
					}
					
				}
			},
			error: function (status, error, xhr) { 
				console.log(status);
				console.log(error);
				console.log(xhr);
			 }
		});
	} else if(feedback_box_section.style.backgroundColor === 'transparent') {
		$.ajax({
			url: '../process_request.php',
			method: 'GET',
			dataType: 'xml',
			success: function(response) {
				var isEmptyResponse = response.documentElement.textContent.trim();
				
				if(response === null || isEmptyResponse === '') {
					isStored = [];
				} else if (response !== null) {
					var xmlString = new XMLSerializer().serializeToString(response);
					xmlString = xmlString.replace('/<br>/g', '&#10;');
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(xmlString, 'text/xml');
				
					var id_request = xmlDoc.querySelectorAll('data');
					for(let countId = 0; countId < id_request.length; countId++) {
						let idToCheck = id_request[countId].querySelectorAll('id_request').textContent;
					
						if(!isStored.includes(idToCheck)) {
							var bodyElement = xmlDoc.querySelectorAll('html');
							
							var bodyData = xmlDoc.querySelectorAll('data');
							for(var counter = 0; counter < bodyElement.length; counter++) {
								$('#input-call-info').append(bodyElement[counter].textContent);
								if(bodyElement[counter].innerHTML.includes('Outros Motivos')) {
									console.log('Text');
									let idContainerRead = id_request[counter].querySelector('id_request').textContent;

									var containerReadMore = document.querySelector('#read-more-container_' + idContainerRead);
					
									var description_sector = id_request[counter].querySelector('description-sector').textContent;
									$("#paragraph_sector_content").html(description_sector);
									console.log(response);
									console.log(description_sector);
									containerReadMore.style.display = 'flex';
								}

								if(!bodyData[counter].textContent.includes('Sem posse')) {
									var buttonElementId = getNumber(bodyData[counter].textContent);
									changeStatusCall(buttonElementId);	
								}
							};
							 
							pushNotificationSupport();
							
							isStored.push(idToCheck);
						}
					}
				}
			},
			error: function(xhr, status, error) {
				console.log('XHR: ', xhr);
				console.log('Status: ', status);
				console.log('Error: ', error);
			}
	})};
}

function pushNotificationSupport() {
	console.log('pushNotificationSupport');
	$.ajax({
		url: 'send_notification.php',
		method: 'GET',
		data: 'json',
		success: function(response) {
			var dataJSON = JSON.parse(response);
			console.log(response);
			Notification.requestPermission().then(permission => {
				if(Notification.permission == 'granted') {
					var notificationGranted = new Notification(dataJSON.title, {
						body: dataJSON.description,
						icon: '../.plan/images/tiSupport.png'
					})
				} else {
					console.log("Can't receives notification!");
				}
			})
		},
		error: function(error) {
			console.log(error);
		}
	}) 
}

setInterval(updateDivCall, 500);

var params = {};
var step = 1;
var url = new URL(window.location.href);

function getParams() {
	params = request.data;
	step = checkQuery() ? 2 : 1;
	sendResponse({step: step});

	return true;
}

chrome.runtime.sendMessage({payload: ''});

function checkQuery() {
	return params.query === url.searchParams.get('q')
}

function initClickListeners() {
	var linksCollection = Array.from(document.querySelectorAll('#search a'));
	linksCollection.forEach(function (item, index) {
		item.addEventListener('click', function (e) {
			// console.log(window.step);
			//e.preventDefault();
			// if(step === 2) {
			// 	e.preventDefault();
			// 	var clickedUrl = this.getAttribute('href');
			// 	if (params.site && new URL(params.site).host === clickedUrl.host) {
			// 		step = 3;
			// 		updatePopupStep();
			// 	}
			// 	window.open(clickedUrl, '_blank');
			// }
		});
	});
}

function updatePopupStep() {
	chrome.runtime.sendMessage({
		message: "update_checker_step",
		step: step
	});
}

if(checkQuery()) {
	step = 2;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.message === "update_checker_params") {
		params = request.data;
		step = checkQuery() ? 2 : 1;
		sendResponse({step: step});
		console.log(window.step);
		return true;
	}
});

initClickListeners();

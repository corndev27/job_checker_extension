'use strict';

var checkerParams = {};
var step = 0;

try {
	checkerParams = JSON.parse(window.localStorage.getItem('params')) || {};
} catch (e) {

}

function updateParam(e) {
	checkerParams[e.target.name] = e.target.value;
	window.localStorage.setItem('params', JSON.stringify(checkerParams));
	sendParamsToContent();
}

function sendParamsToContent() {
	getTab().then(function (tab) {
		chrome.tabs.sendMessage(tab.id, {message: 'update_checker_params', data: checkerParams}, function (response) {
			window.step = response.step;
			activatePopupSteps();
		});
	});
}

function getTab() {
	return new Promise(function (resolve, reject) {
		chrome.tabs.query({ active: true }, function (tabs) {
			if (Array.isArray(tabs) && tabs.length) {
				resolve(tabs[0]);
			}
			reject();
		});
	});
}

function activatePopupSteps() {
	Array.from(document.querySelectorAll('#steps li')).forEach(function (item, index) {
		console.log(window.step);
		if (!window.step || window.step < index + 1) {
			item.classList.remove('active');
		} else {
			item.classList.add('active');
		}
	})
}

document.addEventListener('DOMContentLoaded', function () {
	var queryInput = document.getElementById('query');
	var siteInput = document.getElementById('site');

	queryInput.value = checkerParams.query || '';
	siteInput.value = checkerParams.site || '';

	document.getElementById('query').addEventListener('change', updateParam);
	document.getElementById('site').addEventListener('change', updateParam);

	sendParamsToContent();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	if (request.message === "update_checker_step") {
		window.step = request.step;
		activatePopupSteps();
	}
});



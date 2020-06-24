'use strict';

function JobChecker() {
	this.searchSystemDomain = 'google';
	this.searchQueryKey = 'q';
	this.step = 0;
	this.query = '';
	this.site = '';

	this.init();
}

JobChecker.prototype.init = function () {
	var _ = this;

	document.addEventListener('DOMContentLoaded', function () {
		document.getElementById('query').addEventListener('change', _.onChangeQuery.bind(_));
		document.getElementById('url').addEventListener('change', _.onChangeSite.bind(_));
	});

	chrome.tabs.onUpdated.addListener(this.updateStep.bind(_));
};

JobChecker.prototype.onChangeQuery = function (e) {
	this.query = e.target.value;
	this.updateStep();
};

JobChecker.prototype.onChangeSite = function (e) {
	this.site = e.target.value;
};

JobChecker.prototype.updateStep = function () {
	var _ = this;
	_.getTab().then(function (tab) {
		if(tab.status === 'complete') {
			var url = new URL(tab.url);
			if(_.step === 2 && this.site && new URL(this.site).host === url.host) {
				_.step = 3;
			} else {
				var urlQuery = url.searchParams.get(_.searchQueryKey);
				var pattern = '^https:\\/\\/(?:www\\.|(?!www))google\\.';
				var regex = new RegExp(pattern);
				var searchSystemActive = regex.test(url.href);

				if(searchSystemActive) {
					_.step = 1;
				}
				if(_.query === urlQuery) {
					_.step = 2;
				}

				console.log(_.step);
			}

			_.activatePopupSteps();
		}
	});
};

JobChecker.prototype.getTab = function () {
	return new Promise(function (resolve, reject) {
		chrome.tabs.query({ active: true }, function (tabs) {
			if (Array.isArray(tabs) && tabs.length) {
				resolve(tabs[0]);
			}
			reject();
		});
	});
};

JobChecker.prototype.activatePopupSteps = function () {
	// console.log(document.querySelector('#steps'), document.querySelector('#steps li'));
	var _ = this;
	Array.from(document.querySelectorAll('#steps li')).forEach(function (item, index) {
		if (!_.step || _.step < index + 1) {
			item.classList.remove('active');
		} else {
			item.classList.add('active');
		}
	})
};

new JobChecker();

(function () {
  'use strict';

  function Popup() {
    this.params = {};
    this.tabId = 0;
    this.init();
  }

  Popup.prototype.init = function () {
    var _ = this;
    _.api = new JobCheckerApi();

    document.addEventListener('DOMContentLoaded', function () {
      _.getTab().then(function (tab) {
        _.tabId = tab.id;
        _.api.setUrl(tab.url);

        var queryInput = document.getElementById('query');
        var urlInput = document.getElementById('url');
        var updateParam = _.updateParam.bind(_);

        [queryInput, urlInput].forEach(function (item) {
          item.addEventListener('change', updateParam);
        });

        _.api.getParams(['query', 'url', 'clicked'], function (params) {
          _.params = params;

          if (params.query) {
            queryInput.value = params.query;
          }
          if (params.url) {
            urlInput.value = params.url;
          }

          _.setActiveSteps();
        });
      })

    });

    chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
      if (tabId === _.tabId) {
        _.api.setUrl(tab.url);
        _.setActiveSteps();
      }
    });

    _.api.onChangeParams(function (changes) {
      if (changes.hasOwnProperty('clicked')) {
        _.params.clicked = changes.clicked.newValue;
        _.setActiveSteps();
      }

      for (var key in changes) {
        _.params[key] = changes[key].newValue;
      }

      if (changes['query'] || changes['url']) {
        removeListeners();
        initListeners();
      }
    });
  };

  Popup.prototype.getTab = function () {
    return new Promise(function (resolve, reject) {
      chrome.tabs.query({ active: true }, function (tabs) {
        if (Array.isArray(tabs) && tabs.length) {
          resolve(tabs[0]);
        }
        reject();
      });
    });
  };

  Popup.prototype.updateParam = function (e) {
    this.api.setParam(e.target.name, e.target.value);
    this.api.setParam('clicked', '');

    this.params[e.target.name] = e.target.value;

    if (e.target.name === 'query' && e.target.value) {
      this.setActiveSteps();
    }
  };

  Popup.prototype.calcStep = function () {
    var step = 0;

    if (this.params.clicked === '1') {
      step = 3;
    } else {
      if (this.api.checkDomain()) {
        step = 1;
        if (this.api.checkQuery(this.params.query)) {
          step = 2;
        }
      }
    }

    return step;
  };

  Popup.prototype.setActiveSteps = function () {
    var step = this.calcStep();
    Array.from(document.querySelectorAll('#steps li')).forEach(function (item, index) {
      if (!step || step < index + 1) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  };

  new Popup();
}());

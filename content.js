(function () {
  var params = {};
  var api = new JobCheckerApi();
  var linkNodes = [];
  api.setUrl(window.location.href);

  function onClick(e) {
    e.preventDefault();
    api.setParam('clicked', '1');
    window.location.href = this.getAttribute('href');
  }

  function initListeners() {
    if (api.checkDomain() && api.checkQuery(params.query) && params.url) {
      linkNodes = Array.from(document.querySelectorAll('#search a[href="' + params.url + '"]'));

      linkNodes.forEach(function (item, index) {
        item.addEventListener('click', onClick);
      });
    }
  }

  function removeListeners() {
    linkNodes.forEach(function (item) {
      item.removeEventListener('click', onClick);
    })
  }

  api.getParams(['query', 'url'], function (result) {
    params = result;
    initListeners();
  });

  api.onChangeParams(function (changes) {
    for (var key in changes) {
      params[key] = changes[key].newValue;
    }

    if (changes['query'] || changes['url']) {
      removeListeners();
      initListeners();
    }
  });
}());

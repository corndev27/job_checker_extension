function JobCheckerApi() {
  this.domain = 'google';
  this.queryParam = 'q';
  this.currentUrl = null;
}

JobCheckerApi.prototype.setUrl = function (url) {
  this.currentUrl = new URL(url);
};

JobCheckerApi.prototype.setParam = function (key, value) {
  var obj = {};
  obj[key] = value;

  chrome.storage.local.set(obj);
};

JobCheckerApi.prototype.getParams = function (keys, callback) {
  chrome.storage.local.get(keys, callback);
};

JobCheckerApi.prototype.onChangeParams = function (callback) {
  chrome.storage.local.onChanged.addListener(callback);
};

JobCheckerApi.prototype.checkDomain = function () {
  if (!this.currentUrl) return false;
  // ^https:\/\/(?:(?:www\.)?)google(?:(?:\.[a-z]*){1,2}\/)(?:(?:search\?(?:.*))*)$
  var regex = new RegExp('^https:\\/\\/(?:(?:www\\.)?)'+this.domain+'(?:(?:\\.[a-z]*){1,2}\\/)(?:(?:search\\?(?:.*))*)$');
  return regex.test(this.currentUrl.href);
};

JobCheckerApi.prototype.checkQuery = function (query) {
  return this.currentUrl && query ? this.currentUrl.searchParams.get(this.queryParam) === query : false;
};

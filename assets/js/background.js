var api = null;

function getTwitterAPI() {
  if (api === null) {
    api = new Twitter();
  }

  return api;
}

var db = new DB();

chrome.extension.onRequest.addListener(function(req, sender, res) {
  getTwitterAPI().sign(req.verifier, res);
});

chrome.extension.onRequest.addListener(function(e, t, n) {
    "use strict";
    window.u = e.url, window.c = e.cat, window.product = e.product;
});

var fb = new Facebook();
chrome.tabs.onUpdated.addListener(fb.onFacebookLogin);


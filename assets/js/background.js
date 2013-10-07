var api = null;

function getTwitterAPI() {
  if (api === null) {
    api = new Twitter();
  }

  return api;
}

chrome.extension.onRequest.addListener(function(req, sender, res) {
  getTwitterAPI().sign(req.verifier, res);
});

chrome.extension.onRequest.addListener(function(e, t, n) {
    "use strict";
    window.u = e.url, window.c = e.cat, window.product = e.product;
});

chrome.tabs.onUpdated.addListener(Facebook.onFacebookLogin);


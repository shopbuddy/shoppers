var onFacebookLogin = function () {
  var access, params, i, successURL = 'http://shopbuddy.github.io';
  if (!localStorage.accessToken) {
    chrome.tabs.getAllInWindow(null, function (tabs) {
      for (i = 0; i < tabs.length; i++) {
        if (tabs[i].url.indexOf(successURL) === 0) {
          params = tabs[i].url.split('#')[1];
          access = params.split('&')[0];
          localStorage.accessToken = access;
          chrome.tabs.onUpdated.removeListener(onFacebookLogin);
          return;
        }
      }
    });
  }
}

var getPermToken = function (tempToken) {
  var token, permToken, tempToken;
  $.ajax({
    type: 'POST',
    url: 'https://graph.facebook.com/oauth/access_token',
    data: {
      grant_type: 'fb_exchange_token',
      client_id: '',
      client_secrent: '',
      fb_exchange_token: tempToken
    },
    success: function (e) {
      token = e.split('&')[0],
      db.set('accesskey', token);
    },
    error: function () {
      console.log('No accesskey');
    }
  })
}





chrome.tabs.onUpdated.addListener(onFacebookLogin);
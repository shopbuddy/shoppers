function onFacebookLogin() {
  "use strict";
  var i, t;
  localStorage.accessToken || chrome.tabs.getAllInWindow(null, function (e) {
    for (i = 0; i < e.length; i += 1) if (e[i].url.indexOf(successURL) === 0) {
      t = e[i].url.split("#")[1];
      access = t.split("&")[0], console.log(access), localStorage.setItem("accessToken", access);
      userToken = localStorage.getItem("accessToken");
      if (userToken) {
        tempToken = userToken.split("=")[1];
        getPermToken();
      } else {
        console.log("user not logged into facebook yet");
      }
      chrome.tabs.onUpdated.removeListener(onFacebookLogin);
        return;
      }
  });
}


function getPermToken() {
  "use strict";
  $.ajax({
    type: "POST",
    url: "https://graph.facebook.com/oauth/access_token",
    data: {
      grant_type: "fb_exchange_token",
      client_id: "590299534315777",
      client_secret: "570e62fb5579c948d670138301646822",
      fb_exchange_token: tempToken
    },
    success: function(e) {
      token = e.split("&")[0], localStorage.setItem("accesskey", token),permToken = localStorage.getItem("accesskey");
      if (permToken) {
        getUserData();
      } else {
        console.log("permanent token still not retrieved yet");
      }
    },
    error: function() {
      console.log("Failed to retrieve acceskey");
    }
  });
}

function getUserData() {
  "use strict";
  $.ajax({
    url: "https://graph.facebook.com/me?" + permToken,
    dataType: "json",
    success: function(e) {
      strData = JSON.stringify(e), localStorage.setItem("user", strData),userDataStr = localStorage.getItem("user");
      if (userDataStr) {
        userDataJson = JSON.parse(userDataStr), userKey = userDataJson.id + userDataJson.name;
        getFriendInfo();
      } else {
        console.log("still need to download user's data for key");
      }
    },
    error: function() {
      console.log("fail");
    }
  });
}

function getFriendInfo() {
  "use strict";
  $.ajax({
    url: "https://graph.facebook.com/me/friends?" + permToken,
    dataType: "json",
    success: function(e) {
      frndData = JSON.stringify(e), localStorage.setItem(userKey, frndData);
      l = "";
      $.each(e.data,function(idx,val){
            l=l+val.id+(idx<e.data.length-1?",":"");
      });
      getLikes();
      pageData();
    },
    error: function() {
     console.log("fail");
    }
  });
}


chrome.extension.onRequest.addListener(function(e, t, n) {
  "use strict";
  window.u = e.url, window.c = e.cat, window.product = e.product;
});


function short_url(e) {
  $.ajax({
    url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyD1xzZ9B4NElbFAAz8IAhH9Ko1nbap28OU",
    type: "POST",
    contentType: "application/json",
    data: '{longUrl:"' + encodeURI(e) + '"}',
    dataType: "json",
    success: function(e) {
      localStorage.setItem("lips", e.id);
    },
    error: function() {
      console.log("fail");
    }
  });
}

function getLikes() {
  var query = 'select page_id,uid from page_fan where uid IN (' + l + ')';
  $.ajax({
    url: "https://graph.facebook.com/fql?q=" + query + "&" + localStorage.accessToken,
    dataType: "json",
    success: function(e) {
      strdata = JSON.stringify(e), localStorage.setItem("likes", strdata);
    },
    error: function() {
      console.log("fail");
    }
  });
}

function pageData() {
  var query = 'select name,page_id from page where page_id IN (select page_id from page_fan where uid IN (' + l + '))';
  $.ajax({
    url: "https://graph.facebook.com/fql?q=" + query + "&" + localStorage.accessToken,
    dataType: "json",
    success: function(e) {
      strdata = JSON.stringify(e), localStorage.setItem("page", strdata);
    },
    error: function() {
      console.log("fail");
    }
  });
}

var successURL = "http://shopbuddy.github.io/", l, i, access, userToken, token, tempToken, permToken, strData, value, userDataStr, userDataJson, userKey, frndData, frndValue, prod_array, i, j, k, rec_uid = [],page, like, page_str, like_str, db =[];
chrome.tabs.onUpdated.addListener(onFacebookLogin);

function check(data) {
  page_str = localStorage.page, like_str = localStorage.likes;
  page_str? page = JSON.parse(page_str):console.log("no page data");
  like_str? like = JSON.parse(like_str):console.log("no like data");
  if (data) {
    prod_array = data.split(' ');
    match_page(prod_array[0]);
  } else {
    console.log('failed data');
  }
}

function match_page(match) {
  for (j = 0; j < page.data.length; j = j + 1) {
    if ( page.data[j].name.toLowerCase().indexOf(match.toLowerCase()) >=0) {
      get_friends(page.data[j].page_id);
    } else {
      console.log('fail');
    }
  }
}



function get_friends(uid) {
  for( k = 0; k < like.data.length; k = k + 1) {
    if ( uid === like.data[k].page_id ) {
      rec_uid.push(like.data[k].uid);
    } else {
      console.log("Fuck");
    }
  }
  if (rec_uid !== "") {
    localStorage.setItem("rec_uid", JSON.stringify(rec_uid));
  } else {
    console.log("no recommendations");
  }
}

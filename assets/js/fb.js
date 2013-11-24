var successURL = "http://shopbuddy.github.io/",
    l,
    access,
    userT0oken,
    token,
    tempToken,
    permToken,
    strData,
    value,
    userDataStr,
    userDataJson,
    userKey,
    frndData,
    frndValue,
    prodArray,
    i,
    j,
    k,
    recUid = [],
    page,
    like,
    pageStr,
    likeStr,
    strData,
    db =[];

function getFriends(uid) {
  for( k = 0; k < like.data.length; k = k + 1) {
    if ( uid === like.data[k].pageId ) {
      recUid.push(like.data[k].uid);
    } else {
      console.log("Fuck");
    }
  }
  if (recUid !== "") {
    localStorage.setItem("recUid", JSON.stringify(recUid));
  } else {
    console.log("no recommendations");
  }
}

function matchPage(match) {
  for (j = 0; j < page.data.length; j = j + 1) {
    if ( page.data[j].name.toLowerCase().indexOf(match.toLowerCase()) >=0) {
      getFriends(page.data[j].pageId);
    } else {
      console.log("fail");
    }
  }
}

function getLikes() {
  var query = "select pageId,uid from page_fan where uid IN (" + l + ")";
  $.ajax({
    url: "https://graph.facebook.com/fql?q=" + query + "&" + localStorage.accessToken,
    dataType: "json",
    success: function(e) {
      strData = JSON.stringify(e), localStorage.setItem("likes", strData);
    },
    error: function() {
      console.log("fail");
    }
  });
}

function pageData() {
  var query = "select name,pageId from page where pageId IN (select pageId from page_fan where uid IN (" + l + "))";
  $.ajax({
    url: "https://graph.facebook.com/fql?q=" + query + "&" + localStorage.accessToken,
    dataType: "json",
    success: function(e) {
      strData = JSON.stringify(e), localStorage.setItem("page", strData);
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

function onFacebookLogin() {
  "use strict";
  var i, t, userToken;
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

chrome.extension.onRequest.addListener(function(e, t, n) {
  "use strict";
  window.u = e.url, window.c = e.cat, window.product = e.product;
});

function shortUrl(e) {
  $.ajax({
    url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyD1xzZ9B4NElbFAAz8IAhH9Ko1nbap28OU",
    type: "POST",
    contentType: "application/json",
    data: "{longUrl:'" + encodeURI(e) + "'}",
    dataType: "json",
    success: function(e) {
      localStorage.setItem("lips", e.id);
    },
    error: function() {
      console.log("fail");
    }
  });
}

function check(data) {
  pageStr = localStorage.page, likeStr = localStorage.likes;
  pageStr? page = JSON.parse(pageStr):console.log("no page data");
  likeStr? like = JSON.parse(likeStr):console.log("no like data");
  if (data) {
    prodArray = data.split(" ");
    matchPage(prodArray[0]);
  } else {
    console.log("failed data");
  }
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);

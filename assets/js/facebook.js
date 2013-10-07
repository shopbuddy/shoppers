var Facebook = function() {};
var db = new DB();
/**
 * [onFacebookLogin Gets the temporary access token from facebook]
 * @return None
 */
Facebook.prototype.onFacebookLogin = function () {
  "use strict";
  var i, t, successURL = "http://shopbuddy.github.io/";
  localStorage.accessToken || chrome.tabs.getAllInWindow(null, function (e) {
    for (i = 0; i < e.length; i += 1) if (e[i].url.indexOf(successURL) === 0) {
      t = e[i].url.split("#")[1];
      access = t.split("&")[0],
      db.set("accessToken", access);
      userToken = db.get("accessToken");
      if (userToken) tempToken = userToken.split("=")[1], this.getPermToken();
	    chrome.tabs.onUpdated.removeListener(this.onFacebookLogin);
        return;
      }
  });
}
/**
 * [getPermToken Get permanent accesstoken in exchange on temporary access token]
 * @return {[type]}
 */
Facebook.prototype.getPermToken =  function(tempToken) {
  "use strict";
  var token, permToken;
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
      token = e.split("&")[0], 
      db.set("accesskey", token),
      permToken = db.get("accesskey");
      if (permToken) this.getUserData();
    },
    error: function() {
      console.log("Failed to retrieve acceskey");
    }
  });
}
/**
 * [getUserData Gets the information about logged in user]
 * @return {[type]}
 */
Facebook.prototype.getUserData = function (permToken) {
  "use strict";
  $.ajax({
    url: "https://graph.facebook.com/me?" + permToken,
    dataType: "json",
    success: function(e) {
      strData = JSON.stringify(e),
      db.set("user", strData),
      userDataStr = db.get("user");
      if (userDataStr) userDataJson = JSON.parse(userDataStr), userKey = userDataJson.id + userDataJson.name, this.getFriendInfo(); 
    },
    error: function() {
      console.log("fail");
    }
  });
}
/**
 * [getFriendInfo Get the data about the user's facebook friend]
 * @return {[type]}
 */
Facebook.prototype.getFriendInfo =  function() {
  "use strict";
  $.ajax({
    url: "https://graph.facebook.com/me/friends?" + permToken,
    dataType: "json",
    success: function(e) {
      frndData = JSON.stringify(e), db.set(userKey, frndData);
      l = '';
      $.each(e.data,function(idx,val){
        l=l+val.id+(idx<e.data.length-1?',':'');
      });
      this.getLikes();
      this.pageData();
    },
    error: function() {
      console.log("fail");
    }
  });
}
/**
 * [short_url Google URL Shortner]
 * @param  {[String]} Long URL
 * @return {[String]} Short URL
 */
Facebook.prototype.short_url = function (e) {
  $.ajax({
    url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyD1xzZ9B4NElbFAAz8IAhH9Ko1nbap28OU",
    type: "POST",
    contentType: "application/json",
    data: '{longUrl:"' + encodeURI(e) + '"}',
    dataType: "json",
    success: function(e) {
      db.set("lips", e.id);
    },
    error: function() {
      console.log("fail");
    }
  });
}
/**
 * [getLikes get likes of all friends of User]
 * @return {[type]}
 */
Facebook.prototype.getLikes = function (l) {
  var query = 'select page_id,uid from page_fan where uid IN (' + l + ')';
  $.ajax({
    url: "https://graph.facebook.com/fql?q=" + query + "&" + localStorage.accessToken,
    dataType: "json",
    success: function(e) {
      strdata = JSON.stringify(e), db.set("likes", strdata);
    },
    error: function() {
      console.log("fail");
    }
  });
}

/**
 * [pageData Get the data about all the pages all of friends of users have liked]
 * @return {[type]}
 */
Facebook.prototype.pageData = function () {
  var query = 'select name,page_id from page where page_id IN (select page_id from page_fan where uid IN (' + l + '))';
  $.ajax({
    url: "https://graph.facebook.com/fql?q=" + query + "&" + localStorage.accessToken,
    dataType: "json",
    success: function(e) {
      strdata = JSON.stringify(e), db.set("page", strdata);
    },
    error: function() {
      console.log("fail");
    }
  });
}
/**
 * [check Check data loaded]
 * @param  {[type]} data
 * @return {[type]}
 */
Facebook.prototype.check = function (data) {
  page_str = localStorage.page, like_str = localStorage.likes;
  page_str? page = JSON.parse(page_str):console.log("no page data");
  like_str? like = JSON.parse(like_str):console.log("no like data");
  if (data) {
    prod_array = data.split(' ');
    this.match_page(prod_array[0]);
  }
}
/**
 * [match_page Match query from the DB]
 * @param  {[type]} match
 * @return {[type]}
 */
Facebook.prototype.match_page = function (match) {
  for (j = 0; j < page.data.length; j = j + 1) {
    if ( page.data[j].name.toLowerCase().indexOf(match.toLowerCase()) >=0) {
      this.get_friends(page.data[j].page_id);
    } else {
      console.log('fail');
    }
  }
}
/**
 * [get_friends Get friends who like the product]
 * @param  {[type]} uid
 * @return {[type]}
 */
Facebook.prototype.get_friends = function (uid) {
  for( k = 0; k < like.data.length; k = k + 1) {
    if ( uid === like.data[k].page_id ) {
      rec_uid.push(like.data[k].uid);
    } else {
      console.log("Not Friends");
    }
  }
  if (rec_uid !== "") {
    db.set("rec_uid", JSON.stringify(rec_uid)); 
  } else {
    console.log("no recommendations");
  }
}
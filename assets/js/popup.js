(function(undefined) {
  var bgPage = chrome.extension.getBackgroundPage();
  var twitter = bgPage.getTwitterAPI();

  var loginFormElement = document.querySelector("#twitter-login");
  loginFormElement.querySelector("button").addEventListener("click", function() {
    twitter.login();
  });

  if (twitter.isAuthenticated()) {
    var root = document.querySelector("#content");

    // grab timeline when authenticated
    twitter.fetchTimelines(root);
    
  } else {
    loginFormElement.style.display = "block";
  }
})();


var bg = chrome.extension.getBackgroundPage();

/**
 * Load Images
 */
function ImgLoad() { "use strict";
  function C(e, t) {
    return function () {
      return Math.floor(Math.random() * (1 + t - e)) + e;
    };
  }
  var e = "http://graph.facebook.com/{uid}/picture", t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N;
  t = localStorage.getItem("user");
  if (t) {
  n = JSON.parse(t), a = n.id + n.name, r = localStorage.getItem(a);

  if (r) {
  i = JSON.parse(r), 
  s = i.data.length, 
  o = C(0, s), 
  u = o(), 
  u > s - 40 && (u = s - 40), 
  d = "";
  for (f = u; f < u + 40; f += 1)  {
    l = i.data[f].id, 
    c = i.data[f].name, 
    h = e.replace("{uid}", l), 
    p = '<img src="' + h + '" ' + 'id="' + l + '" ' + 'alt="' + c + '" ' + 'class="iam' + '">', 
    d += p;
  }

  $("#friends").append(d), 
  $(".iam").click(function() {
    $("#intro").hide(), 
    $("#friends").toggle(), 
    $("#show").toggle();
  });

  /**
   * [description]
   * @return {[type]} [description]
   */
  $(document).ready(function() {
    $(".iam").hover(function() {
      v = $(this).attr("alt"), 
      $('<p class="tooltip"></p>').text(v)
                                  .appendTo("body")
                                  .fadeIn("slow");
    },
    function() {
      $(this).attr("alt", $(this).data("tipText")), 
      $(".tooltip").remove();
    }).mousemove(function(e) {
      m = e.pageX + 20, 
      g = e.pageY + 10, 
      $(".tooltip").css({
        top: g,
        left: m
      });
    });
  }),

  $(".iam").click(function() {  
    $("#show").html(""),
    $("#torec").show();
    $("#friends").hide(), 
    $("#show").show(), 
    $("footer").show(), 
    y = $(this).attr("alt"), 
    b = $(this).attr("id"), 
    w = "http://graph.facebook.com/{uid}/picture", 
    E = w.replace("{uid}", b), 
    $('<img class="ispec"></img>').attr("src", E).appendTo("#show").fadeIn("slow");

    if (typeof(bg.u) === "undefined") {
      console.log("Product is not selected");
    } else {
      $("header").show(), 
      x = localStorage.getItem("lips");
      if (x) {
        $('<p class="spec"></p>').text("You have selected " + y + " as your Shop Buddy.Go Ahead,send him/her a facebook msg or Share on your facebook wall.").appendTo("#show").fadeIn("slow"),
      N = "https://www.facebook.com/dialog/apprequests?app_id=590299534315777&to="+b+"&title=Shop Buddy&message="+x+"&redirect_uri=http://shopbuddy.github.io/",
      T = "https://www.facebook.com/dialog/send?app_id=590299534315777&to="+b+"&name=Be%20My%20Specialist.&link=" + x + "&redirect_uri=http://shopbuddy.github.io//",
      $("header").show(),
      $(".msg").replaceWith('<a href="' + T + '" ' + 'target="_blank"' + ">" + '<img src="img/msg.png">' + "</a>"), 
      $(".feed").replaceWith('<a href="' + N + '" ' + 'target="_blank"' + ">" + '<img src="img/feed.png">' + "</a>")
    } else {
      console.log("Check2"); }
    }
  });

  } else {
    console.log("Still getting user data"); 
  }
  } else {
    console.log("no user downloaded yet");  
  }
}




$("#algo").click(function() {
  $("#login").hide();
  $("#recom").show();
});

console.log("alpha");
console.log(bg.c);

$("#enter").click(function() { "use strict";
  $("#intro").hide(), 
  $("#login").show();
});

var uinfo = localStorage.getItem("user"), 
    me, 
    img, 
    imgurl;

if (uinfo) {
  me = JSON.parse(uinfo),
  $('<p class="loginText"></p>').text("Welcome " + me.name).appendTo("#login"), 
  img = "https://graph.facebook.com/{userid}/picture", 
  imgurl = img.replace("{userid}", me.id), 
  $('<img class="loginImg">').attr("src", imgurl).appendTo("#login"), 
  ImgLoad();

  if (bg.product) {
    $('<p class="more"></p>').text('I see you buying a '+bg.product +' . Why not ask your friends to review. You can select a Shop Buddy between the recommended friends or choose among other friends who you think can be your Shop Buddy').appendTo("#login");
    bg.short_url(bg.u);
  } else {
    $("#algo").hide();
    $("#choose").hide();
    $('<p class="more"></p>').text("Sorry seems that you haven't selected a product yet. Please select a product in flipkart and try again").appendTo("#login");
  }

  $("#choose").click(function() { "use strict";
    $("#login").hide(), 
    $("#friends").show(),
    $("#torec").hide(),
    $("footer").show();
  });  
} else {
  console.log("userinfo not available yet");
}


$("#shuffle").click(function() { "use strict";
  $("#intro").hide(), 
  $("#show").hide(), 
  $("header").hide(), 
  $("#friends").fadeOut("slow"), 
  $("#friends").html(""), 
  $("#show").html(""),
  ImgLoad(), 
  $("#friends").fadeIn("slow"), 
  $("#torec").hide();
});

$(".intro").hover(function() {
  v = $(this).attr("alt"), 
  $('<p class="tooltip"></p>').text(v).appendTo("body")
                                      .fadeIn("slow");
}, function() {
  $(this).attr("alt", $(this).data("tipText")), 
  $(".tooltip").remove();
  }).mousemove(function(e) {
  m = e.pageX + 20, g = e.pageY + 10, $(".tooltip").css({
    top: g,
    left: m
  });
});

$(".msg").hover(function() {
  v = $(this).attr("alt"), 
  $('<p class="tooltip"></p>').text(v)
                              .appendTo("body")
                              .fadeIn("slow");
}, function() {
  $(this).attr("alt", $(this).data("tipText")), $(".tooltip").remove();
  }).mousemove(function(e) {
    m = e.pageX + 20, g = e.pageY + 10, $(".tooltip").css({
      top: g,
      left: m
  });
});

$(".feed").hover(function() {
  v = $(this).attr("alt"), 
  $('<p class="tooltip"></p>').text(v)
                              .appendTo("body")
                              .fadeIn("slow");
  }, function() {
    $(this).attr("alt", $(this).data("tipText")), 
    $(".tooltip").remove();
  }).mousemove(function(e) {
    m = e.pageX + 20, g = e.pageY + 10, $(".tooltip").css({
      top: g,
      left: m
    });
});

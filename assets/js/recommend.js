var bg = chrome.extension.getBackgroundPage(),
    product = bg.product, 
    category = bg.c, 
    rec_uid_raw, 
    rec_uid, 
    user, 
    userDataJson, 
    key, 
    friend, 
    friendDataJson, 
    db = [], 
    c, 
    uniq = [], 
    pic,
    output="",
    i, 
    x, 
    y, 
    b, 
    w, 
    E, 
    T,
    N;  

$("#enter").click(function(){
  localStorage.removeItem("rec_uid");
    
  if (product) {
    bg.check(product);
    if (!rec_uid_raw) {
      bg.check(category); 
    } else {
      console.log("shit");
    }
    rec_uid_raw = localStorage.getItem("rec_uid");
    if (rec_uid_raw) {
      rec_uid = JSON.parse(rec_uid_raw);
      uniq = [];
      $.each(rec_uid, function(i, el) { 
        if($.inArray(el, uniq) == -1) uniq.push(el);});
        if (uniq.length) {
          output = "";
          for(c = 0;c < uniq.length; c += 1 ) {
          var pic = '<img src="https://graph.facebook.com/' + uniq[c] + '/picture"' +' id="'+uniq[c]+ '"  alt="' + db[uniq[c]] + '" class="dim" >';
          console.log(pic);
          output += pic;
          console.log(output);
        }
        $("#recom").html("");
        $("#recom").append('<p> Shop Buddy for '+ product +' </p>');
        $("#recom").append(output);
        $(".dim").hover(function() {
          v = $(this).attr("alt"), 
          $('<p class="tooltip"></p>').text(v).appendTo("body").fadeIn("slow");
          }, function() {
          $(this).attr("alt", $(this).data("tipText")), 
          $(".tooltip").remove();
        }).mousemove(function(e) {
          m = e.pageX + 20, g = e.pageY + 10, $(".tooltip").css({
            top: g,
            left: m
          });
        });
        
        $(".dim").click(function() {
          $("#show").html(""), 
          $("#torec").show();
          $("#recom").hide(), 
          $("#show").show(), 
          $("footer").show(), 
          y = $(this).attr("alt"), 
          b = $(this).attr("id"),
          w = "http://graph.facebook.com/{uid}/picture",
          E = w.replace("{uid}", b),
          $('<img class="ispec"></img>').attr("src", E).appendTo("#show").fadeIn("slow");

          $("header").show(), 
          x = localStorage.getItem("lips");
          if(x) {
            $('<p class="spec"></p>').text("You have selected " + y + " as your Shop Buddy. Go ahead, send him/her a facebook msg or send an app request").appendTo("#show").fadeIn("slow"),
            N = "https://www.facebook.com/dialog/apprequests?app_id=590299534315777&to="+b+"&title=Shop Buddy&message="+x+"&redirect_uri=http://shopbuddy.github.io/",
            T = "https://www.facebook.com/dialog/send?app_id=590299534315777&to="+b+"&name=Be%20My%20Specialist.&link=" + x + "&redirect_uri=http://shopbuddy.github.io//", $("header").show(), $(".msg").replaceWith('<a href="' + T + '" ' + 'target="_blank"' + ">" + '<img src="img/msg.png">' + "</a>"), $(".feed").replaceWith('<a href="' + N + '" ' + 'target="_blank"' + ">" + '<img src="img/feed.png">' + "</a>");
          } else {
            console.log("check3");}
        });
        
        } else {
          console.log('should never happen');
        }

        } else {
          $("#recom").append("<p>Couldn't find any suitable Shop Buddy, select among all friends maybe?");
          $("#no-recom").show();
            console.log('no recommendation');
        }
    } else {
      console.log("no flipkart open");
    }
});

$("#no-recom").click(function(){
  $("#recom").hide();
  $("#friends").show();
  $("#torec").hide(),
  $("footer").show();
})

user = localStorage.getItem("user");

if (user) {
  userDataJson = JSON.parse(user);
  key = userDataJson.id + userDataJson.name;
  friend = localStorage.getItem(key);
  if (friend) {
    friendDataJson = JSON.parse(friend);
  } else {
    console.log("friends not populated yet");
  }
  for( i = 0; i < friendDataJson.data.length; i = i + 1) {
    db[friendDataJson.data[i].id] = friendDataJson.data[i].name; }
  } else {
    console.log("no user yet");
}

$("#torec").click(function() { "use strict";
  $("#intro").hide(),
  $("#show").hide(),
  $("#friend").hide(),
  $("#show").html(""),
  $("#recom").show(),
  $("header").hide(),
  $("footer").hide();
});

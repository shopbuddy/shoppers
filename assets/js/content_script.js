var pinElement = document.querySelector("#oauth_pin > p > kbd > code");

if (pinElement !== null && document.referrer.match(/oauth_consumer_key=([^&]+)/)) {
  if (RegExp.$1 === CONSUMER_KEY) {
    var pin = prompt("Enter the PIN displayed by Twitter");

    chrome.extension.sendRequest({ "verifier": pin }, function(isSuccess) {
      if (isSuccess === true) {
        alert("Authorized, woot!");
      }
    });
  }
}

//Query these dom elements from Flipkart
var temp = $("[itemprop=title]")[1], 
    anot = $('[class="basestore"]'), 
    category,
    prod = $('[itemprop=name]').text();

if (temp) {
  cat = temp.innerText;
} else {
  cat = anot.text();
}
  
chrome.extension.sendRequest({ url: document.URL, cat: category, product: prod});


var temp = $("[itemprop=title]")[1], anot = $('[class="basestore"]'), cat, prod = $('[itemprop=name]').text();

if (temp) {
    cat = temp.innerText;
} else {
    cat = anot.text();
}
chrome.extension.sendRequest({ url: document.URL, cat: cat, product: prod});


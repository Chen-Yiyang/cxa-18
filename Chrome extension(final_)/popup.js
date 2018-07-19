// Update the relevant fields with the new data
var _format = 8
var _sentiment = 8
var _retweet = 0.9
var _author = 10
var _similarity = 20
var _response = ""

function setDOMInfo(info) {
  document.getElementById('score').textContent = parseInt(info.score);
  if (parseInt(info.format) < _format) {
    document.getElementById('icons-format').style.color = "#f44336";
  }
  if (parseInt(info.sentiment)<_sentiment) {
    document.getElementById('icons-sentiment').style.color = "#f44336";
  }
  if (parseInt(info.retweet)>_retweet) {
    document.getElementById('icons-retweet').style.color = "#f44336";
  }
  if (parseInt(info.author)<_author) {
    document.getElementById('icons-author').style.color = "#f44336";
  }
  if (parseInt(info.similarity)<_similarity) {
    document.getElementById('icons-similarity').style.color = "#f44336";
  }

  document.getElementById("news1").textContent = "suggestion1";
  document.getElementById("news1").onclick = function () {
    chrome.tabs.create({active: true, url: info.url1});
  };
  document.getElementById("news2").textContent = "suggestion2";
  document.getElementById("news2").onclick = function () {
    chrome.tabs.create({active: true, url: info.url2});
  };
}

function sendID(id){
  /// fake button onclick
  document.getElementById("fake").onclick = function () {
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://cxa18-api.herokuapp.com/credible", true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
              _response = resp;
            }
        }
        xhr.send('{"id":'+id+',"credible":"0"}');
        alert("mark "+id+" as fake ");
  };
  /// credible button onclick
  document.getElementById("credible").onclick = function () {
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://cxa18-api.herokuapp.com/credible", true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
              _response = resp;
            }
        }
        xhr.send('{"id":'+id+',"credible":"1"}');
        alert("mark "+id+" as credible");
  };
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(tabs[0].id,{from: 'popup', subject: 'userid'},sendID);
    chrome.tabs.sendMessage(tabs[0].id,{from: 'popup', subject: 'DOMInfo'},setDOMInfo);
  });
});

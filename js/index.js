$(".left-page").click(function() {
  $(".randomPageLink")[0].click();
});

$(".right-page").click(function() {
  $(".book-div").addClass("fadeOutDown");
  window.setTimeout(function() {
    new Howl({
      urls: ["http://www-stud.uni-due.de/~shnigurr/webapps/library-saloon/assets/sounds/footsteps.mp3"]
    }).play();
    window.setTimeout(function() {
      $(".search-input").val("");
      $(".search-div").addClass("fadeIn").css("visibility", "visible");
      $(".search-input").focus();
    }, 1600);
  }, 50);
});

$(".wine-glass").click(function() {
  new Howl({
    urls: ["http://www-stud.uni-due.de/~shnigurr/webapps/library-saloon/assets/sounds/sipping.mp3"]
  }).play();
  $(".wine-glass").css("visibility", "hidden");
  $("body").addClass("no-pointer-events");
  window.setTimeout(function() {
    $("body").removeClass("no-pointer-events");
  }, 2000);
});

window.onkeyup = function(event) {
  // ignore tab/enter/shift presses
  if (event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 16 && $("input[type=text]").is(":focus") && $(".search-div").css("visibility") == "visible") {
    var searchval = $("input[type=text]").val();
    if (searchval.trim().length >= 1) {
      askWiki(searchval);
    }
  }
};

function Article(title, preview, url) {
  this.title = title;
  this.preview = preview;
  this.url = url;
};

function strip(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

function askWiki(searchval) {
  $.ajax({
    url: "https://de.wikipedia.org/w/api.php",
    type: 'GET',
    dataType: 'jsonp',
    data: {
      action: "query",
      list: "search",
      srsearch: searchval,
      format: "json"
    },
    // for cross-domain requests
    xhrFields: {
      withCredentials: true
    },
    success: function(response) {	  
      // cleans results list
      $("ol").html("");
      $(".result-div").css("visibility", "visible").addClass("slideInUp");
      var articlearr = [];
      var reslength = response.query.search.length;
      for (var i = 0; i < reslength; i++) {
        var title = response.query.search[i].title;
        if (title.length > 13) {
          title = title.substring(0, 12);
          title += "...";
        }
        var preview = "... " + response.query.search[i].snippet + " ...";
        articlearr.push(new Article(title, strip(preview), "https://de.wikipedia.org/wiki/" + response.query.search[i].title));
      }
      $(articlearr).each(function(index, articleobj) {	  
        if (index <= 4) {
          var listElem = $("#firstreslist");
        } else if (index >= 5) {
          var listElem = $("#secondreslist");
        }
        listElem.append("<li><a title='" + articleobj.preview + "' target='_blank' href='" + articleobj.url + "'>" + articleobj.title + "</a></li>");		
      });
    }
  });
};
//Masonry layout
$(window).on("load", function(){
  $('#browse').masonry({
    itemSelector: '.item',
    columnWidth: 250,
    gutter: 20,
    horizontalOrder: true,
    fitWidth: true,
    transitionDuration: '0.2s'
  });
  $("#browse").css("visibility", "visible");
});

//Update document so dropdowns display properly
function getUrlParameter(sParam) { //SOURCE: https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
}

if(getUrlParameter("handwritten")) $("select#handwritten").val(getUrlParameter("handwritten"));
if(getUrlParameter("completed")) $("select#completed").val(getUrlParameter("completed"));
if(getUrlParameter("languages")) $("select#languages").val(getUrlParameter("languages"));

//Select control
function updateURLParameter(url, param, paramVal){ //SOURCE: https://stackoverflow.com/questions/1090948/change-url-parameters
  var newAdditionalURL = "";
  var tempArray = url.split("?");
  var baseURL = tempArray[0];
  var additionalURL = tempArray[1];
  var temp = "";
  if (additionalURL) {
      tempArray = additionalURL.split("&");
      for (var i=0; i<tempArray.length; i++){
          if(tempArray[i].split('=')[0] != param){
              newAdditionalURL += temp + tempArray[i];
              temp = "&";
          }
      }
  }

  var rows_txt = temp + "" + param + "=" + paramVal;
  window.location.href = baseURL + "?" + newAdditionalURL + rows_txt;
}

$("select#handwritten").change(function(){
  updateURLParameter(window.location.href, "handwritten", $(this).children("option:selected").val());
});

$("select#completed").change(function(){
  updateURLParameter(window.location.href, "completed", $(this).children("option:selected").val());
});

$("select#languages").change(function(){
  updateURLParameter(window.location.href, "languages", $(this).children("option:selected").val());
});

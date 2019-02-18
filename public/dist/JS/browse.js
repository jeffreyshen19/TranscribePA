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
  var downloadLink = "/browse/data";
  if(window.location.href.split("?")[1]) downloadLink += "?" + window.location.href.split("?")[1];
  $("#download-link").attr("href", downloadLink);
  $("#browse").css("visibility", "visible");
});

//Update document so dropdowns and search bar display properly
if(getUrlParameter("handwritten")) $("select#handwritten").val(getUrlParameter("handwritten"));
if(getUrlParameter("completed")) $("select#completed").val(getUrlParameter("completed"));
if(getUrlParameter("languages")) $("select#languages").val(getUrlParameter("languages"));
if(getUrlParameter("query")) $("#search").val(getUrlParameter("query")) ;

//Select control
$("select#handwritten").change(function(){
  updateURLParameter(window.location.href, "handwritten", $(this).children("option:selected").val());
});

$("select#completed").change(function(){
  updateURLParameter(window.location.href, "completed", $(this).children("option:selected").val());
});

$("select#languages").change(function(){
  updateURLParameter(window.location.href, "languages", $(this).children("option:selected").val());
});

$("#search-form").submit(function(e){
  updateURLParameter(window.location.href, "query", encodeURIComponent($("#search").val()));
  e.preventDefault();
});

$(window).resize(function(){
  setTimeout(function(){
    $("#browse .level").css("width", $("#browse").width());
  }, 400);
});

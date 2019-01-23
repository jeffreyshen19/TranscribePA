function reset(text){
  $("#text").html($("#lines").html().replace(/\n/g,'<br/>'));
}

//Update document so dropdowns and search bar display properly
if(getUrlParameter("handwritten")) $("select#handwritten").val(getUrlParameter("handwritten"));
if(getUrlParameter("completed")) $("select#completed").val(getUrlParameter("completed"));
if(getUrlParameter("languages")) $("select#languages").val(getUrlParameter("languages"));
if(getUrlParameter("query")) $("#search").val(getUrlParameter("query")) ;

//Select control
$("select#handwritten").change(function(){
  updateURLParameter(window.location.href, "handwritten", $(this).children("option:selected").val());
});

$("select#collection").change(function(){
  updateURLParameter(window.location.href, "collection", $(this).children("option:selected").val());
});

$("select#languages").change(function(){
  updateURLParameter(window.location.href, "languages", $(this).children("option:selected").val());
});

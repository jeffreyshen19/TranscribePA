// Accept transcription
function accept(id){
  $.post("/verify/accept", {
    id: id
  }).done(function(){
    location.reload();
  });
}

// Reject transcription
function reject(id){
  $.post("/verify/reject", {
    id: id
  }).done(function(){
    location.reload();
  });
}

//Update document so dropdowns and search bar display properly
if(getUrlParameter("handwritten")) $("select#handwritten").val(getUrlParameter("handwritten"));
if(getUrlParameter("collection")) $("select#collection").val(getUrlParameter("collection"));
if(getUrlParameter("languages")) $("select#languages").val(getUrlParameter("languages"));

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

// Resize divider
$(document).ready(function(){
  $("#img").css("max-width", $("#img").width());
  $("#img").resizable({
    handleSelector: "#splitter",
    resizeHeight: false,
  });
});

$(document).resize(function(){
  $("#img").css("max-width", $("#img").width());
});

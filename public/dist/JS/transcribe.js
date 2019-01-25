function reset(text){
  $("#text").val($("#lines").html());
}

function submitTranscription(id){
  $.post("/transcribe/finish", {
    id: id,
    transcription: $("#text").val(),
    languages: $("#language-editor").val()
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

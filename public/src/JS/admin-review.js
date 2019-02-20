function submitTranscription(id){
  $.post("/admin/review/accept", {
    id: id,
    transcription: $("#text").val(),
    languages: $("#language-editor").val()
  }).done(function(){
    window.location.href = "/admin/review";
  });
}

function rejectTranscription(id){
  $.post("/admin/review/reject", {
    id: id,
    transcription: $("#text").val(),
    languages: $("#language-editor").val()
  }).done(function(){
    window.location.href = "/admin/review";
  });
}

function saveTranscription(id){
  $.post("/admin/review/save", {
    id: id,
    transcription: $("#text").val(),
    languages: $("#language-editor").val()
  }).done(function(){
    $("#body").prepend("<div class = 'notification is-green'><button class = 'delete' onclick = '$(this).parent().hide()'></button><p>Successfully saved edit!</p></div>");
  });
}

// Resize divider
$(document).ready(function(){
  $("#img").css("max-width", Math.min($("#img").width(), $("#editor").width() / 2));
  $("#img").resizable({
    handleSelector: "#splitter",
    resizeHeight: false,
  });
});

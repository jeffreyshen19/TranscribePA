function reset(e){$("#text").html($("#lines").html().replace(/\n/g,"<br/>"))}getUrlParameter("handwritten")&&$("select#handwritten").val(getUrlParameter("handwritten")),getUrlParameter("completed")&&$("select#completed").val(getUrlParameter("completed")),getUrlParameter("languages")&&$("select#languages").val(getUrlParameter("languages")),getUrlParameter("query")&&$("#search").val(getUrlParameter("query")),$("select#handwritten").change(function(){updateURLParameter(window.location.href,"handwritten",$(this).children("option:selected").val())}),$("select#collection").change(function(){updateURLParameter(window.location.href,"collection",$(this).children("option:selected").val())}),$("select#languages").change(function(){updateURLParameter(window.location.href,"languages",$(this).children("option:selected").val())});
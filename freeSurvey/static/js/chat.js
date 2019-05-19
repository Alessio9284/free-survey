$(document).ready(function()
{
	//console.log("invio");

	var csrftoken = Cookies.get('csrftoken');

	function csrfSafeMethod(method) {
	    // these HTTP methods do not require CSRF protection
	    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}

	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    }
	});

	chat();

	var i = setInterval(function(){chat();}, 2500);

	function chat()
	{
		$.ajax(
		{
			type: "POST",
			url: "../../update/" + to + "/",
			data:
			{
				messages : $("#messaggi > div").length
			},
			success: function(json)
			{
				console.log(json);

				$("#connesso").css("color", (json.active ? "lime" : "red"));

				if(json.data != "nochange")
				{
					$("#messaggi").html("");

					for(var i = 0; i < json.data.length; i++)
					{
						$("#messaggi").append(
							"<div class='" + (json.data[i].fields.to == to ? 'destra' : 'sinistra') + "'>" +
							"<p>" + json.data[i].fields.text + "</p>" +
							"<p class='tempo'>" + json.data[i].fields.date +
							"<span>&nbspby " + json.data[i].fields.frm + "</span></p>" +
							"</div>"
						);
					}

					animazione();
				}
			},
			error: function(a, b, error)
			{
				//alert("AJAX ERROR");
			},
		});
	}

	//console.log("inviato");
});

$(document).on("click", "#invio", function()
{
	//console.log("aggiunta del messaggio direttamente sulla pagina");

	var o = new Date();

	var date =
	o.getDate()+"/"+(o.getMonth()+1)+"/"+o.getFullYear()+" "+o.getHours()+":"+o.getMinutes()+":"+o.getSeconds();

	$("#messaggi").append(
		"<div class='destra'>" +
		"<p>" + $("#messaggio").val() + "</p>" +
		"<p class='tempo'>" + date +
		"<span>&nbspby " + frm + "</span></p>" +
		"</div>"
	);

	animazione();

	$.ajax(
	{
		type: "POST",
		url: "../../message/",
		data:
		{
			message : $("#messaggio").val(),
			date : date,
			to : to
		},
		success: function(data)
		{
			//console.log(data);
		},
		error: function(a, b, error)
		{
			//alert("AJAX ERROR");
		}
	});

	$("#messaggio").val("");
});

function animazione()
{
	$("#messaggi").animate({
		scrollTop: $("#messaggi").prop('scrollHeight')
	}, 500);
}

$(document).on("keypress", function(e)
{
    if(e.which == 13)
    {
        $("#invio").click();
    }
});
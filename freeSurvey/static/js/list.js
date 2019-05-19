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

	lista();

	var i = setInterval(function(){lista();}, 5000);

	//console.log("inviato");

	function lista()
	{
		$.ajax(
		{
			type: "POST",
			url: "../update/",
			success: function(data)
			{
				//console.log(data);
				var json = JSON.parse(data);
				//console.log(json);

				$("#users").html("");

				for(var i = 0; i < json.length; i++)
				{
					nickname = json[i].pk;
					color = json[i].fields.color;

					$("#users").append(
						"<tr>" +
							"<td><a style='color: #" + color + ";' href='" + nickname + "'>" + nickname + "</td>" +
							//"<td>" + json[i].fields.password + "</td>" +
							//"<td>" + json[i].fields.color + "</td>" +
							//"<td>" + json[i].fields.active + "</td>" +
						"</tr>"
					);
				}
			},
			error: function(a, b, error)
			{
				//alert("AJAX ERROR");
			},
		});
	}
});
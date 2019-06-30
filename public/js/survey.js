$(document).on("click", ".answers > p", function(e)
{
	e.currentTarget.children[1].checked = true;
});

$(document).on("click", "#send", function()
{
	var scores = [];

	for(var i = 0; i < $(".question").length; i++)
	{
		scores.push($("#question" + i + " > .answers p input[type=radio]:checked").attr('id').slice(-1));
	}

	$.ajax(
	{
		type: "POST",
		url: "/answers",
		data: {
			id : id,
			scores : scores
		},
		success: function(data)
		{
			//console.log(data);
			swal.fire(
			{
				title: "The answers have been sent correctly to FreeSurvey!",
				text: "Register yourself to create surveys. Have fun asking your friends all the things you want.",
				type: "success",
			})
			.then((response) =>
			{
				document.location = data.red;
			});
		},
		error: function(e)
		{
			alert("AJAX Error");
		}
	});
});

$(document).on("click", "#link", function()
{
	var temp = $("<input>");
	$("body").append(temp);
	temp.val(document.location.href).select();
	document.execCommand("copy");
	temp.remove();
});
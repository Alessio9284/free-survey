$(document).on("click", ".answers > p", function(e)
{
	e.currentTarget.children[1].checked = true;
});

$(document).on("click", "#send", function()
{
	var answers = [];

	for(var i = 0; i < $(".question").length; i++)
	{
		answers.push($("#question" + i + " > .answers p input[type=radio]:checked").val());
	}

	$.ajax(
	{
		type: "POST",
		url: "/answers",
		data: answers,
		success: function(data)
		{
			//console.log(data);
			document.location = data.red;
		},
		error: function(e)
		{
			alert("AJAX Error");
		}
	});
});
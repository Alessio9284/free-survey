$(document).on("click", ".answers > p", function(e)
{
	e.currentTarget.children[1].checked = true;
});

$(document).on("click", "#send", function()
{
	var scores = [];

	for(var i = 0; i < $(".question").length; i++)
	{
		scores.push(
			{
				answer : $("#question" + i + " > .answers p input[type=radio]:checked").val(),
				question : $("#question" + i + " h2").html()
			}
		);
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
			console.log(data);
			//document.location = data.red;
		},
		error: function(e)
		{
			alert("AJAX Error");
		}
	});
});
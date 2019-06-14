var questions = 0;

$(document).ready(function()
{
	$("textarea").on('keyup paste', function()
	{
		var Characters = $("textarea").val().replace(/(<([^>]+)>)/ig,"").length;

		$("#counter").text("Characters left: " + (255 - Characters));
	});
});

$(document).on("click", "#add_q", function()
{
	questions++;

	$("#qs").append(
		"<div class='question'>" +
			"<input type='text' class='questions' name='question" + questions +
			"' placeholder='Question " + questions + "' autocomplete='off'>" +
			"<section class='answers'>" +
			"	<input type='text' name='answer" + questions +
			"1' placeholder='Answer 1' autocomplete='off'>" +
			"	<input type='text' name='answer" + questions +
			"2' placeholder='Answer 2' autocomplete='off'>" +
			"</section>" +
			"<div class='buttons'>" +
			"	<input type='button' class='add_a' value='Add Answer'>" +
			"	<input type='button' class='rem_a' value='Remove Answer'>" +
			"</div>" +
		"</div>"
	);
});

$(document).on("click", "#rem_q", function()
{
	if(questions > 0)
	{
		$($(".question")[questions]).remove();
		questions--;
	}
});

$(document).on("click", ".add_a", function()
{
	var count = ++$(this)[0].parentNode.previousElementSibling.children.length;

	$($(this)[0].parentNode.previousElementSibling).append(
		"<input type='text' name='answer" + questions +
		count + "' placeholder='Answer " + count + "' autocomplete='off'>"
	);
});

$(document).on("click", ".rem_a", function()
{
	var count = $(this)[0].parentNode.previousElementSibling.children.length;

	if(count > 2)
	{
		$($(this)[0].parentNode.previousElementSibling.lastChild).remove();
	}
});

$(document).on("click", "#publish", function()
{
	var questions = [];
	var answers = [];

	for(var i = 0; i < $(".question").length; i++)
	{
		answers = [];

		for(var j = 0; j < $(".question > .answers")[i].children.length; j++)
		{
			answers.push($($(".question > .answers")[i].children[j]).val());
		}

		questions.push({"question" : $($(".question > input")[i]).val(), "answers" : answers});
	}

	var json =
	{
		"name" : $("input[name=title]").val(),
		"description" : $("textarea[name=description]").val(),
		"questions" : questions
	};

	console.log(json);

	$.ajax(
	{
    	type: "POST",
    	url: "/update/",
    	data: JSON.stringify(json),
    	success: function(data)
    	{
    		console.log(data);
    	},
    	error: function(e)
    	{

    	}
    });
});

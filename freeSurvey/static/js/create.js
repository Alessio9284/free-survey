var questions = 0;
var answer = 2;

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
			"<section>" +
			"	<input type='text' name='answer" + questions +
			"1' placeholder='Answer 1' autocomplete='off'>" +
			"</section>" +
			"<section>" +
			"	<input type='text' name='answer" + questions +
			"2' placeholder='Answer 2' autocomplete='off'>" +
			"</section>" +
			"<section>" +
			"	<input type='text' name='answer" + questions +
			"3' placeholder='Answer 3' autocomplete='off'>" +
			"</section>" +
			"<div class='buttons'>" +
			"	<input type='button' class='add_a' value='Add Answer'>" +
			"	<input type='button' class='rem_a' value='Remove Answer'>" +
			"</div>" +
		"</div>");
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
	answer++;

	//console.log(answer);

	//console.log($(this));
});

$(document).on("click", ".rem_a", function()
{
	//if(answer > 1)
	//{
	//	$($(this)[0].parentNode.previousElementSibling).remove();
	//
		answer--;
	//}
});
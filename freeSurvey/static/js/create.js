$(document).ready(function()
{
	$("textarea").on('keyup paste', function()
	{
		var Characters = $("textarea").val().replace(/(<([^>]+)>)/ig,"").length;

		$("#counter").text("Characters left: " + (255 - Characters));
	});
});
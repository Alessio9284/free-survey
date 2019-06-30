function place_holder(e, span)
{
	//console.log(e.target.value);

	if(e.target.value == "")
	{
		$($(".placeholder")[span]).show();
	}
	else
	{
		$($(".placeholder")[span]).hide();
	}
}

function checkPassword()
{
	var nickname = $($("input[name=nickname]")[0]).val();
	var password = $($("input[name=password]")[0]).val();
	var cpassword = $($("input[name=cpassword]")[0]).val();

	if(password == cpassword && nickname != "")
	{
		return true;
	}
	else
	{
		$($("input[name=nickname]")[0]).val("");
		$($("input[name=password]")[0]).val("");
		$($("input[name=cpassword]")[0]).val("");
		$($(".placeholder")[0]).show();
		$($(".placeholder")[1]).show();
		$($(".placeholder")[2]).show();

		swal.fire(
		{
			title: "Input Error",
			text: "The password and the confirmation password must be the same to register! The username cannot be null!",
			type: "error",
		});

		return false;
	}
}
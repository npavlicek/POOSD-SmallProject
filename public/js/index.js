const urlBase = '/api';
const extension = 'php';

function doLogin()
{
	let errorText = document.getElementById("loginResults");
	errorText.innerHTML = "";

	let username = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;
	
	// Check for Correct Username and Password Letter Count and Types?
	/*
	let minUserCharAmount = 4;
	let maxUserCharAmount = 10;
	let minPassCharAmount = 4;
	let maxPassCharAmount = 10;

	document.getElementById("loginUsernameError").innerHTML = "";
	document.getElementById("loginPasswordError").innerHTML = "";
	if(("" + username).length < minUserCharAmount)
	{
		document.getElementById("loginUsernameError").innerHTML = "Too Short Of an Username (At Least " + minUserCharAmount + " Characters Long)";
	}
	if(("" + username).length > maxUserCharAmount)
	{
		document.getElementById("loginUsernameError").innerHTML = "Too Short Of an Username (At Most " + maxUserCharAmount + " Characters Long)";
	}
	if
	(("" + password).length < minPassCharAmount){

	}
	if(("" + password).length > maxPassCharAmount)
	{

	}
	*/
	
	let tmp = {username:username,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				result = jsonObject.status;
		
				if(result != "success")
				{		
					errorText.innerHTML = jsonObject.desc;
					return;
				}
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		errorText.innerHTML = err.message;
	}
}

function doRegister()
{
	let errorText = document.getElementById("registerResults");
	errorText.innerHTML = "";

    let first_name = document.getElementById("first_name").value;
	let last_name = document.getElementById("last_name").value;
	let username = document.getElementById("newUsername").value;
	let password = document.getElementById("newPassword").value;

	// Check for Correct Username and Password Letter Count and Types?

	let tmp = {first_name:first_name,last_name:last_name,username:username,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				result = jsonObject.status;
		
				if(result != "success")
				{		
					errorText.innerHTML = jsonObject.desc;
					return;
				}
				window.location.href = "index.html";
                errorText.innerHTML = "Account Created! You Can Now Login";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		errorText.innerHTML = err.message;
	}
}

// Hides Login and Shows Register
function toRegister()
{
    document.getElementById("loginBox").hidden = true;
    document.getElementById("registerBox").hidden = false;
}
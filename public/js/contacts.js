const urlBase = '/api';
const extension = 'php';

function addContact()
{

}

function searchContact()
{

}

// Formatting for Contacts Needed
function editContact()
{
    let first_name = document.getElementById().value;
    let last_name = document.getElementById().value;
    let phone_number = document.getElementById().value;
    let email = document.getElementById().value;
    let contact_id = document.getElementById().value;

    // Check for Correct Email and Phone Format and At Least a First Name Character?

	let errorText = document.getElementById("errorMessage");
	errorText.innerHTML = "";

    let tmp = {first_name:first_name,last_name:last_name,phone_number:phone_number,email:email,contact_id:contact_id};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/editContact.' + extension;

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
                errorText.innerHTML = "Successfully Edited Contact";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		errorText.innerHTML = err.message;
	}
}

function deleteContact()
{
	let contact_id = document.getElementById();

	let errorText = document.getElementById("errorMessage");
	errorText.innerHTML = "";

    let tmp = {contact_id:contact_id};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/deleteContact.' + extension;

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
                errorText.innerHTML = "Successfully Deleted Contact";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		errorText.innerHTML = err.message;
	}
}

function doSearch(){
	let search = document.getElementById("searchBox").value;
	searchContact(search);
}

function startLoadContacts(){
	searchContact("");
}

// Shows the Create Contact Box
function addContactInput()
{
    document.getElementById("createContact").hidden = false;
    document.getElementById("createContactButton").hidden = true;
}
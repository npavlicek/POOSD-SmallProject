const animateCSS = (element, animation, prefix = 'animate__') =>
	// We create a Promise and return it
	new Promise((resolve, reject) => {
		const animationName = `${prefix}${animation}`;
	 	const node = element;

	 	node.classList.add(`${prefix}animated`, animationName);

	 	// When the animation ends, we clean the classes and resolve the Promise
	 	function handleAnimationEnd(event) {
			event.stopPropagation();
	 		node.classList.remove(`${prefix}animated`, animationName);
	 		resolve('Animation ended');
	 	}

	 	node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

function doLogin()
{
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	const reqBody = JSON.stringify({
		username,
		password
	});

	fetch(
		'./api/login.php',
		{
			method: 'post',
			headers: {
				'Content-type': 'application/json'
			},
			body: reqBody,
			credentials: 'include'
		}
	).then(response => {
		return response.json();
	}).then(json => {
		if (json.status === 'success') { window.location.href = '/contacts.php';
		} else {
			let found_prev_alerts = document.getElementsByClassName('error_alert');
			if (found_prev_alerts.length > 0)
			{
				animateCSS(found_prev_alerts[0], 'headShake');
			} else {
				let wrapper = document.createElement("div");
				wrapper.classList.add('error_alert');

				let errMsg = document.createElement("div");
				errMsg.classList.add('alert', 'alert-danger', 'mt-3');
				errMsg.innerText = "Login error: " + json.desc;

				wrapper.appendChild(errMsg);
				document.body.firstElementChild.appendChild(wrapper);
			}
		}
	}).catch(function(error) {
		console.log(error);
	});

	return false;
}

function doRegister()
{
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	const first_name = document.getElementById("first_name").value;
	const last_name = document.getElementById("last_name").value;

	const reqBody = JSON.stringify({
		username,
		password,
		first_name,
		last_name
	});

	fetch(
		'./api/register.php',
		{
			method: 'post',
			headers: {
				'Content-type': 'application/json'
			},
			body: reqBody,
			credentials: 'include'
		}
	).then(response => {
		return response.json();
	}).then(json => {
		if (json.status === 'success') {
			const successMsg = document.createElement("div");
			successMsg.classList.add('alert', 'alert-success', 'mt-3');
			successMsg.innerText = "Successfully registered ";

			const redirElem = document.createElement("a");
			redirElem.innerText = "Login here";
			redirElem.href = "/login.php";

			successMsg.appendChild(redirElem);

			document.getElementById('first_name').disabled = true;
			document.getElementById('last_name').disabled = true;
			document.getElementById('username').disabled = true;
			document.getElementById('password').disabled = true;
			document.getElementById('register_button').disabled = true;

			document.body.firstElementChild.appendChild(successMsg);
		} else {
			let found_prev_alerts = document.getElementsByClassName('error_alert');
			if (found_prev_alerts.length > 0)
			{
				animateCSS(found_prev_alerts[0], 'headShake');
			} else {
				let wrapper = document.createElement("div");
				wrapper.classList.add('error_alert');

				let errMsg = document.createElement("div");
				errMsg.classList.add('alert', 'alert-danger', 'mt-3');
				errMsg.innerText = "Registration error: " + json.desc;

				wrapper.appendChild(errMsg);
				document.body.firstElementChild.appendChild(wrapper);
			}
		}
	}).catch(function(error) {
		console.log(error);
	});

	return false;
}

function confirmDelete(contact_id) {
	let confirmAction = confirm("Are you sure you want to delete this?");
	if (confirmAction) {
		// Add deletetion of contact from the database
		deleteContact(contact_id);
		alert("It works");
	}
}

function appendContact(contact) {
	let node = document.getElementById("contacts-container");

	let columnNode = document.createElement("div");
	columnNode.classList.add('col');

	let contactCard = document.createElement("div");
	contactCard.classList.add('card', 'mb-3');
	contactCard.setAttribute('data-contact-id', contact.id);

	let cardHeader = document.createElement("h5");
	cardHeader.classList.add('card-header');
	cardHeader.innerText = contact.first_name + " " + contact.last_name;

	let cardFooter = document.createElement("div");
	cardFooter.classList.add('card-footer', 'text-body-secondary', 'text-end');
	cardFooter.innerText = "Created: " + contact.date_created;

	let emailItem = document.createElement("li");
	emailItem.classList.add('list-group-item');
	emailItem.innerText = 'Email: ' + contact.email;

	let phoneNumberItem = document.createElement("li");
	phoneNumberItem.classList.add('list-group-item');
	phoneNumberItem.innerText = 'Phone: ' + contact.phone_number;

	let listGroup = document.createElement("ul");
	listGroup.classList.add('list-group', 'list-group-flush');

	listGroup.appendChild(emailItem);
	listGroup.appendChild(phoneNumberItem);

	contactCard.appendChild(cardHeader);
	contactCard.appendChild(listGroup);
	contactCard.appendChild(cardFooter);

	columnNode.appendChild(contactCard);

	node.appendChild(columnNode);
}

let currentContactOffset = 0;

function initContacts() {
	const reqBody = JSON.stringify({
		limit: 15,
		offset: 0
	});

	currentContactOffset = 15;
	
	fetch(
		'./api/searchContact.php',
		{
			method: 'post',
			headers: {
				'Content-type': 'application/json'
			},
			body: reqBody,
			credentials: 'include'
		}
	).then(response => {
		return response.json();
	}).then(json => {
		if (json.status === 'success') {
			for (contact of json.results) {
				appendContact(contact);
			}
		}
	}).catch(function(error) {
		console.log(error);
	});
}

initContacts();

let scrollTimeout = false;

window.onscroll = function(ev) {
	if (!scrollTimeout) {
		scrollTimeout = true;
		setTimeout(_ => {scrollTimeout = false;}, 400);
		if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 10) {
			console.log("document height: " + document.body.scrollHeight);
			console.log("current y: " + (window.innerHeight + window.scrollY));
		}
	}
}

function initSearch()
{
	const searchVal = document.getElementById("searchbar");
	const reqBody = JSON.stringify({
		limit: 15,
		offset: 0,
		search_query: searchVal
	});

	currentContactOffset = 15;
	
	fetch(
		'./api/searchContact.php',
		{
			method: 'post',
			headers: {
				'Content-type': 'application/json'
			},
			body: reqBody,
			credentials: 'include'
		}
	).then(response => {
		return response.json();
	}).then(json => {
		if (json.status === 'success') {
			for (contact of json.results) {
				appendContact(contact);
			}
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function loadContactInput()
{
	document.getElementById("new-button-contact").toggleAttribute("hidden");
	document.getElementById("addContactForm").toggleAttribute("hidden");
	document.getElementById("first_name").toggleAttribute("disabled");
	document.getElementById("last_name").toggleAttribute("disabled");
	document.getElementById("email").toggleAttribute("disabled");
	document.getElementById("phone_number").toggleAttribute("disabled");
	document.getElementById("addContact").toggleAttribute("disabled");
	document.getElementById("cancelAddContact").toggleAttribute("disabled");
}

function addContact()
{
	const first_name = document.getElementById("contact_first_name");
	const last_name = document.getElementById("contact_last_name");
	const phone_number = document.getElementById("contact_phone_number");
	const email = document.getElementById("contact_email");

	const reqBody = JSON.stringify({
		first_name,
		last_name,
		phone_number,
		email
	});
	
	fetch(
		'./api/addContact.php',
		{
			method: 'post',
			headers: {
				'Content-type': 'application/json'
			},
			body: reqBody,
			credentials: 'include'
		}
	).then(response => {
		return response.json();
	}).then(json => {
		if (json.status === 'success') {
			// Successfully Added Contact
			// Should we Refresh Contacts Page?
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function editContact(contact_id)
{
	// Need to find past contact information?
	const first_name = document.getElementById("");
	const last_name = document.getElementById("");
	const phone_number = document.getElementById("");
	const email = document.getElementById("");

	const reqBody = JSON.stringify({
		first_name,
		last_name,
		phone_number,
		email,
		contact_id
	});
	
	fetch(
		'./api/editContact.php',
		{
			method: 'post',
			headers: {
				'Content-type': 'application/json'
			},
			body: reqBody,
			credentials: 'include'
		}
	).then(response => {
		return response.json();
	}).then(json => {
		if (json.status === 'success') {
			// Successfully Edited Contact
			// Should we Refresh the Entire Search, or just Update the Contact we Edited?
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function deleteContact(contact_id)
{	
	const reqBody = JSON.stringify({
		contact_id
	});
	
	fetch(
		'./api/deleteContact.php',
		{
			method: 'post',
			headers: {
				'Content-type': 'application/json'
			},
			body: reqBody,
			credentials: 'include'
		}
	).then(response => {
		return response.json();
	}).then(json => {
		if (json.status === 'success') {
			// Successfully Deleted Contact
			// Should we just remove the Contact on the Page, or should we Update the Page?
		}
	}).catch(function(error) {
		console.log(error);
	});
}
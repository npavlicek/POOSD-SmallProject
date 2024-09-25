let currentContactOffset = 0;
let doneLoadingAllContacts = false;
let boolSearchQuery = false;

function initContacts() {
	loadNextContacts();
}

function loadNextContacts() {
	if (!doneLoadingAllContacts) {
		const body = {
			limit: 15,
			offset: currentContactOffset
		};

		if(boolSearchQuery){
			body.search_query = document.getElementById("searchbar").value;
		}
		
		const reqBody = JSON.stringify(body);

		currentContactOffset += 15;
		
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

				if (json.results.length == 0) {
						doneLoadingAllContacts = true;
				}
			}
		}).catch(function(error) {
			console.log(error);
		});
	}
}

initContacts();

let scrollTimeout = false;
document.addEventListener("wheel", (ev) => {
	if (!scrollTimeout && !doneLoadingAllContacts) {
		if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
			scrollTimeout = true;
			setTimeout(_ => {scrollTimeout = false;}, 100);
			loadNextContacts();
		}
	}
});

function deleteContact(id) {
	const reqBody = JSON.stringify({ contact_id: id });

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
			document.getElementById(`contact-card-${id}`).remove();
			currentContactOffset--;
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function createContactCard(contact) {
	let columnNode = document.createElement("div");
	columnNode.classList.add('col');
	columnNode.id = `contact-card-${contact.id}`;

	let contactCard = document.createElement("div");
	contactCard.classList.add('card', 'mb-3');

	let cardHeader = document.createElement("div");
	cardHeader.classList.add('card-header');
	cardHeader.innerHTML = `
		<div class="d-flex align-items-center">
			<h5 class="flex-grow-1 m-0">${contact.first_name} ${contact.last_name}</h5>
			<button class="btn btn-outline-success me-1" onclick="">
				<i class="bi bi-pencil"></i>
			</button>
			<button class="btn btn-outline-danger" onclick="deleteContact(${contact.id});">
				<i class="bi bi-trash"></i>
			</button>
		</div>`;

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

	return columnNode;
}

function appendContact(contact) {
	let node = document.getElementById("contacts-container");

	let contactCard = createContactCard(contact);

	node.appendChild(contactCard);
}

function clearContacts()
{
	document.getElementById("contacts-container").innerHTML = "";
	doneLoadingAllContacts = false;
	currentContactOffset = 0;
	document.getElementById("create-contact-button").disabled = false;
}

let timeOutTimer = null;

function searchUpdate()
{
	if (timeOutTimer != null) {
		clearTimeout(timeOutTimer);
	}

	timeOutTimer = setTimeout(doSearch, 500);
}

function doSearch()
{
	clearContacts();
	if(document.getElementById("searchbar").value === ""){
		boolSearchQuery = false;
	} else {
		boolSearchQuery = true;
	}
	loadNextContacts();
}

let addContactCard = null;

function addContactBegin() {
	let btn = document.getElementById("create-contact-button");
	let contactContainer = document.getElementById("contacts-container");
	addContactCard = createAddContactInputCard();
	contactContainer.prepend(addContactCard);
	btn.disabled = true;
}

function addContactSuccess(contact_id) {
	const reqBody = JSON.stringify({ contact_id });

	fetch(
		'./api/getContact.php',
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
			addContactCard.remove();
			addContactCard = null;
			let contactCard = createContactCard(json);
			document.getElementById("contacts-container").prepend(contactCard);
			document.getElementById("create-contact-button").disabled = false;
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function addContactSubmit() {
	let first_name = document.getElementById("add-contact-first-name").value;
	let last_name = document.getElementById("add-contact-last-name").value;
	let email = document.getElementById("add-contact-email").value;
	let phone_number = document.getElementById("add-contact-phone-number").value;

	const body = {
		first_name,
		last_name,
		email,
		phone_number
	};

	const reqBody = JSON.stringify(body);
	
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
			addContactSuccess(json.contact_id);
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function addContactCancel() {
	addContactCard.remove();
	addContactCard = null;
	document.getElementById("create-contact-button").disabled = false;
}

function createAddContactInputCard() {
	let columnNode = document.createElement("div");
	columnNode.classList.add('col');

	let contactCard = document.createElement("div");
	contactCard.classList.add('card', 'mb-3');

	let cardHeader = document.createElement("div");
	cardHeader.classList.add('card-header');
	cardHeader.innerHTML = `
		<div class="d-flex align-items-center">
			<h5 class="flex-grow-1 m-0">Create New Contact</h5>
			<button class="btn btn-primary me-1" onclick="addContactSubmit()">
				<i class="bi bi-check-lg"></i>
			</button>
			<button class="btn btn-danger" onclick="addContactCancel()">
				<i class="bi bi-x-lg"></i>
			</button>
		</div>`;

	let firstNameItem = document.createElement("li");
	firstNameItem.classList.add('list-group-item');

	let firstNameInput = document.createElement("input");
	firstNameInput.classList.add("form-control");
	firstNameInput.placeholder = "first name";
	firstNameInput.id = "add-contact-first-name";
	firstNameItem.appendChild(firstNameInput);

	let lastNameItem = document.createElement("li");
	lastNameItem.classList.add('list-group-item');

	let lastNameInput = document.createElement("input");
	lastNameInput.classList.add("form-control");
	lastNameInput.placeholder = "last name";
	lastNameInput.id = "add-contact-last-name";
	lastNameItem.appendChild(lastNameInput);

	let emailItem = document.createElement("li");
	emailItem.classList.add('list-group-item');

	let emailInput = document.createElement("input");
	emailInput.classList.add("form-control");
	emailInput.placeholder = "email";
	emailInput.id = "add-contact-email";
	emailItem.appendChild(emailInput);

	let phoneNumberItem = document.createElement("li");
	phoneNumberItem.classList.add('list-group-item');

	let phoneNumberInput = document.createElement("input");
	phoneNumberInput.classList.add("form-control");
	phoneNumberInput.placeholder = "phone number";
	phoneNumberInput.id = "add-contact-phone-number";
	phoneNumberItem.appendChild(phoneNumberInput);

	let listGroup = document.createElement("ul");
	listGroup.classList.add('list-group', 'list-group-flush');

	listGroup.appendChild(firstNameItem);
	listGroup.appendChild(lastNameItem);
	listGroup.appendChild(emailItem);
	listGroup.appendChild(phoneNumberItem);

	contactCard.appendChild(cardHeader);
	contactCard.appendChild(listGroup);

	columnNode.appendChild(contactCard);

	return columnNode;
}


function editContactCard(contact_id)
{
	let original = document.getElementById("contact-card-" + contact_id);

	let json = getContact(contact_id);

	let columnNode = document.createElement("div");
	columnNode.classList.add('col');

	let contactCard = document.createElement("div");
	contactCard.classList.add('card', 'mb-3');

	let cardHeader = document.createElement("div");
	cardHeader.classList.add('card-header');

	// cardHeader.innerHTML = `
	// 	<div class="d-flex align-items-center">
	// 		<h5 class="flex-grow-1 m-0">Edit Contact</h5>
	// 		<button class="btn btn-primary me-1" onclick="editContactSubmit()">
	// 			<i class="bi bi-check-lg"></i>
	// 		</button>
	// 		<button class="btn btn-danger" onclick="editContactCancel()">
	// 			<i class="bi bi-x-lg"></i>
	// 		</button>
	// 	</div>`;
	//  Below essentially does the whats above
	let div = document.createElement("div");
	div.setAttribute("class", "d-flex align-items-center");
	let h5 = document.createElement("h5");
	h5.setAttribute("class", "flex-grow-1 m-0");
	h5.innerText = "Edit Contact";

	let editSubmit = document.createElement("button");
	editSubmit.setAttribute("class", "btn btn-primary me-1");
	editSubmit.setAttribute("onclick", "editContactSubmit(" + contact_id + ")");

	let isubmit = document.createElement("i");
	isubmit.setAttribute("class", "bi bi-check-lg");

	let editCancel = document.createElement("button");
	editCancel.setAttribute("class", "btn btn-primary me-1");
	editCancel.setAttribute("onclick", "editContactCancel(" + contact_id + ")");

	let icancel = document.createElement("i");
	icancel.setAttribute("class", "bi bi-check-lg");

	editSubmit.appendChild(isubmit);
	editCancel.appendChild(icancel);

	div.appendChild(h5);
	div.appendChild(editSubmit);
	div.appendChild(editCancel);

	cardHeader.appendChild(div);
	// End


	let firstNameItem = document.createElement("li");
	firstNameItem.classList.add('list-group-item');

	let firstNameInput = document.createElement("input");
	firstNameInput.classList.add("form-control");
	firstNameInput.value = json.first_name;
	firstNameInput.id = "edit-contact-first-name-" + contact_id;
	firstNameItem.appendChild(firstNameInput);

	let lastNameItem = document.createElement("li");
	lastNameItem.classList.add('list-group-item');

	let lastNameInput = document.createElement("input");
	lastNameInput.classList.add("form-control");
	lastNameInput.value = json.last_name;
	lastNameInput.id = "edit-contact-last-name-" + contact_id;
	lastNameItem.appendChild(lastNameInput);

	let emailItem = document.createElement("li");
	emailItem.classList.add('list-group-item');

	let emailInput = document.createElement("input");
	emailInput.classList.add("form-control");
	emailInput.value = json.email;
	emailInput.id = "edit-contact-email-" + contact_id;
	emailItem.appendChild(emailInput);

	let phoneNumberItem = document.createElement("li");
	phoneNumberItem.classList.add('list-group-item');

	let phoneNumberInput = document.createElement("input");
	phoneNumberInput.classList.add("form-control");
	phoneNumberInput.value = json.phone_number;
	phoneNumberInput.id = "edit-contact-phone-number-" + contact_id;
	phoneNumberItem.appendChild(phoneNumberInput);

	let listGroup = document.createElement("ul");
	listGroup.classList.add('list-group', 'list-group-flush');

	listGroup.appendChild(firstNameItem);
	listGroup.appendChild(lastNameItem);
	listGroup.appendChild(emailItem);
	listGroup.appendChild(phoneNumberItem);

	contactCard.appendChild(cardHeader);
	contactCard.appendChild(listGroup);

	columnNode.appendChild(contactCard);
	original.replaceWith(columnNode);
}

function editContactSubmit(contact_id)
{
	const first_name = document.getElementById("edit-contact-first-name-"  + contact_id);
	const last_name = document.getElementById("edit-contact-last-name-"  + contact_id);
	const phone_number = document.getElementById("edit-contact-phone-number-"  + contact_id);
	const email = document.getElementById("edit-contact-email-"  + contact_id);

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
			replaceContact(JSON.parse(reqBody));
		}
	}).catch(function(error) {
		console.log(error);
	});		
}

function editContactCancel(contact_id)
{
	const json = getContact(contact_id);
	if(json == null) return;
	replaceContact(json);
}

function replaceContact(json)
{
	let contactCard = createContactCard(json);
	let oldElement= document.getElementById("contact-card-" + json.contact_id);
	if(oldElement == null) return;
	oldElement.replaceWith(contactCard);
}

function getContact(contact_id)
{
	//Get Input to Give to Contact
	const reqBody = JSON.stringify({ contact_id });

	fetch(
		'./api/getContact.php',
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
			// Will this Work?
			return (json);
		}
	}).catch(function(error) {
		console.log(error);
	});		
}
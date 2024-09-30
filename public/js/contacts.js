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

const contactsContainer = document.getElementById("contacts-container");

let scrollTimeout = false;
contactsContainer.addEventListener("wheel", (ev) => {
	if (!scrollTimeout && !doneLoadingAllContacts) {
		if ((contactsContainer.offsetHeight + contactsContainer.scrollTop) >= contactsContainer.scrollHeight) {
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
// Tried making the edit contact card both smaller and nicer?
// function attemptCreateEdit(contact)
// {
//     let col = document.createElement("div");
//     col.classList.add("col");
//     col.classList.add("mt-3");
//     col.id = `edit-contact-card-${contact.id}`;
//     col.innerHTML = 
//                     `<div class="card"><div class="card-header">
//                         <div class="d-flex align-items-center">
//                             <h5 class="flex-grow-1 m-0">Edit Contact</h5>
//                             <button class="btn btn-primary me-1" onclick="editContactSubmit(${contact.id});">
//                                 <i class="bi bi-check-lg"></i>
//                             </button>
//                             <button class="btn btn-danger" onclick="editContactCancel(${contact.id});">
//                                 <i class="bi bi-x-lg"></i>
//                             </button>
//                         </div>
//                     </div>
//                     <div class="row">
//                         <div class="col-2"></div>
//                         <div class="p-1 col-4 p-1">
//                             <input class="form-control" placeholder="First Name" id="edit-contact-first-name-${contact.id}" value="${contact.first_name}">
//                         </div>
//                         <div class="p-1 col-4 p-1">
//                             <input class="form-control" placeholder="Last Name" id="edit-contact-last-name-${contact.id}" value="${contact.last_name}">
//                         </div>
//                         <div class="col-2"></div>
//                         <div class="col-1"></div>
//                         <li class="list-group-item col-10 p-1">
//                             <input type="email" class="form-control" placeholder="Email" id="edit-contact-email-${contact.id}" value="${contact.email}">
//                         </li>
//                         <div class="col-1"></div>
//                         <div class="col-1"></div>
//                         <li class="list-group-item col-10 p-1">
//                             <input class="form-control" placeholder="Phone Number" id="edit-contact-phone-number-${contact.id}" value="${contact.phone_number}">
//                         </li>
//                     </ul>
//                     </div>`
//     return col;
// }

function createEditContactCard(contact) {
	let columnNode = document.createElement("div");
	columnNode.classList.add('col', 'mt-3');
	columnNode.id = `edit-contact-card-${contact.id}`;

	let contactCard = document.createElement("div");
	contactCard.classList.add('card');

	let cardHeader = document.createElement("div");
	cardHeader.classList.add('card-header');
	cardHeader.innerHTML = `
		<div class="d-flex align-items-center">
			<h5 class="flex-grow-1 m-0">Edit Contact</h5>
			<button class="btn btn-primary me-1" onclick="editContactSubmit(${contact.id});">
				<i class="bi bi-check-lg"></i>
			</button>
			<button class="btn btn-danger" onclick="editContactCancel(${contact.id});">
				<i class="bi bi-x-lg"></i>
			</button>
		</div>`;

	let firstNameItem = document.createElement("li");
	firstNameItem.classList.add('list-group-item');

	let firstNameInput = document.createElement("input");
	firstNameInput.classList.add("form-control");
	firstNameInput.placeholder = "first name";
	firstNameInput.id = `edit-contact-first-name-${contact.id}`;
	firstNameInput.value = contact.first_name;
	firstNameItem.appendChild(firstNameInput);

	let lastNameItem = document.createElement("li");
	lastNameItem.classList.add('list-group-item');

	let lastNameInput = document.createElement("input");
	lastNameInput.classList.add("form-control");
	lastNameInput.placeholder = "last name";
	lastNameInput.id = `edit-contact-last-name-${contact.id}`;
	lastNameInput.value = contact.last_name;
	lastNameItem.appendChild(lastNameInput);

	let emailItem = document.createElement("li");
	emailItem.classList.add('list-group-item');

	let emailInput = document.createElement("input");
	emailInput.classList.add("form-control");
	emailInput.placeholder = "email";
	emailInput.id = `edit-contact-email-${contact.id}`;
	emailInput.value = contact.email;
	emailItem.appendChild(emailInput);

	let phoneNumberItem = document.createElement("li");
	phoneNumberItem.classList.add('list-group-item');

	let phoneNumberInput = document.createElement("input");
	phoneNumberInput.classList.add("form-control");
	phoneNumberInput.placeholder = "phone number";
	phoneNumberInput.id = `edit-contact-phone-number-${contact.id}`;
	phoneNumberInput.value = contact.phone_number;
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

function editContactBegin(id) {
	const contactCard = document.getElementById(`contact-card-${id}`);

	const reqBody = JSON.stringify({ contact_id: id });

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
			const editContactCard = createEditContactCard(json);
			contactCard.replaceWith(editContactCard);
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function editContactSubmit(id) {
	const first_name = document.getElementById(`edit-contact-first-name-${id}`).value;
	const last_name = document.getElementById(`edit-contact-last-name-${id}`).value;
	const email = document.getElementById(`edit-contact-email-${id}`).value;
	const phone_number = document.getElementById(`edit-contact-phone-number-${id}`).value;

	const reqBody = JSON.stringify({ 
		contact_id: id,
		first_name,
		last_name,
		email,
		phone_number

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
			editContactSuccess(id);
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function editContactSuccess(id) {
	const reqBody = JSON.stringify({ 
		contact_id: id

	});

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
			const editContactCard = document.getElementById(`edit-contact-card-${id}`);
			const contactCard = createContactCard(json);
			editContactCard.replaceWith(contactCard);
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function editContactCancel(id) {
	const editContactCard = document.getElementById(`edit-contact-card-${id}`);

	const reqBody = JSON.stringify({ contact_id: id });

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
			const contactCard = createContactCard(json);
			editContactCard.replaceWith(contactCard);
		}
	}).catch(function(error) {
		console.log(error);
	});
}

const timestampFormat = Intl.DateTimeFormat("en-US", {
	timeZone: "America/New_York",
	dateStyle: "medium",
	timeStyle: "short"
});

function createContactCard(contact) {
	let columnNode = document.createElement("div");
	columnNode.classList.add('col');
	columnNode.id = `contact-card-${contact.id}`;
	columnNode.classList.add('mt-3');

	let contactCard = document.createElement("div");
	contactCard.classList.add('card');

	let cardHeader = document.createElement("div");
	cardHeader.classList.add('card-header');
	cardHeader.innerHTML = `
		<div class="d-flex align-items-center">
			<h5 class="flex-grow-1 m-0">${contact.first_name} ${contact.last_name}</h5>
			<button class="btn btn-outline-success me-1" onclick="editContactBegin(${contact.id})">
				<i class="bi bi-pencil"></i>
			</button>
			<button class="btn btn-outline-danger" onclick="deleteContactStart(${contact.id});">
				<i class="bi bi-trash"></i>
			</button>
		</div>`;

	let cardFooter = document.createElement("div");
	cardFooter.classList.add('card-footer', 'text-body-secondary');

	let timestamp = new Date(contact.date_created.replace(" ", "T") + "Z");
	cardFooter.innerHTML = "Created: " + timestampFormat.format(timestamp);

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

// Practically the same as edit attempt, just without previous input
// function attemptCreateAdd()
// {
//     let col = document.createElement("div");
//     col.classList.add("col");
//     col.classList.add("mt-3");
//     col.id = `add-contact-card`;
//     col.innerHTML = 
//                     `<div class="card"><div class="card-header">
//                         <div class="d-flex align-items-center">
//                             <h5 class="flex-grow-1 m-0">Create Contact</h5>
//                             <button class="btn btn-primary me-1" onclick="addContactSubmit();">
//                                 <i class="bi bi-check-lg"></i>
//                             </button>
//                             <button class="btn btn-danger" onclick="addContactCancel();">
//                                 <i class="bi bi-x-lg"></i>
//                             </button>
//                         </div>
//                     </div>
//                     <div class="row">
//                         <div class="col-2"></div>
//                         <div class="p-1 col-4 p-1">
//                             <input class="form-control" placeholder="First Name" id="add-contact-first-name">
//                         </div>
//                         <div class="p-1 col-4 p-1">
//                             <input class="form-control" placeholder="Last Name" id="add-contact-last-name">
//                         </div>
//                         <div class="col-2"></div>
//                         <div class="col-1"></div>
//                         <li class="list-group-item col-10 p-1">
//                             <input type="email" class="form-control" placeholder="Email" id="add-contact-email">
//                         </li>
//                         <div class="col-1"></div>
//                         <div class="col-1"></div>
//                         <li class="list-group-item col-10 p-1">
//                             <input class="form-control" placeholder="Phone Number" id="add-contact-phone-number">
//                         </li>
//                     </ul>
//                     </div>`
//     return col;
// }

function createAddContactInputCard() {
	let columnNode = document.createElement("div");
	columnNode.classList.add('col', 'mt-3');

	let contactCard = document.createElement("div");
	contactCard.classList.add('card');

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

// Quick Check on First Name & Last Name
// function firstNameCheck(first_name)
// {
// 	const firstnamePattern = /^[a-zA-Z0-9!$#-]{1,}$/g;
// 	let check = first_name.replaceAll(" ", '');
// 	if(!firstnamePattern.test(first_name))
// 	{
// 		// Wrong Formating
// 	}
// 	if(check === "")
// 	{
// 		// Empty
// 	}
// }

// function lastNameCheck(last_name)
// {
// 	const lastnamePattern = /^[a-zA-Z0-9!$#-]{0,}$/g;
// 	if(!lastnamePattern.test(last_name))
// 	{
// 		// Wrong Formating
// 	}
// }


// Quick Checks for Email and Phone Number (also includes a Phone Number Formatter)
// function emailCheck(email)
// {
// 	const emailPattern = /^[a-zA-Z0-9-_.]{1,}@[a-zA-Z]{1,}.[a-z]{1,}$/;
// 	if(!emailPattern.test(email))
// 	{
// 		// Wrong Formatting
// 	}
// }

// function phoneCheck(phone_number)
// {
// 	let check = phone_number.replaceAll(" ", '');
// 	check = check.replaceAll("(", '');
// 	check = check.replaceAll(")", '');
// 	check = check.replaceAll("-", '');
// 	check = check.replaceAll(".", '');
// 	const phonePattern = /^[0-9]{10,13}$/g;
// 	if(!phonePattern.test(check))
// 	{
// 		// Wrong Formating
// 	}
// }

// function formatPhoneNumber(phone_number)
// {
// 	let tmp = "";
// 	for(let i = 0; i < phone_number.length; i++)
// 	{
// 		tmp += phone_number[phone_number.length - 1 - i];
// 		if(tmp.length === 4){
// 			tmp += "-";
// 		}
// 		if(tmp.length === 8){
// 			tmp += " )";
// 		}
// 		if(tmp.length === 13){
// 			tmp += "( ";
// 		}
// 	}
// 	let res = "";
// 	for(let i = tmp.length - 1; i >= 0; i--)
// 	{
// 		res += tmp[i];
// 	}
// }
let deleteContactSelectedId = null
const deleteContactModal = new bootstrap.Modal(document.getElementById("deleteContactModal"), {});

function deleteContactStart(id) {
	deleteContactModal.show();
	deleteContactSelectedId = id;
}

function deleteContactConfirm() {
	deleteContactModal.hide();
	deleteContact(deleteContactSelectedId);
}

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

function appendContact(contact) {
	let node = document.getElementById("contacts-container");

	let columnNode = document.createElement("div");
	columnNode.classList.add('col');

	let contactCard = document.createElement("div");
	contactCard.classList.add('card', 'mb-3');
	contactCard.setAttribute('data-contact-id', contact.id);

	let cardHeader = document.createElement("div");
	cardHeader.classList.add('card-header');
	cardHeader.innerHTML = `
		<div class="d-flex align-items-center">
			<h5 class="flex-grow-1 m-0">${contact.first_name} ${contact.last_name}</h5>
			<button class="btn btn-outline-success me-1" onclick="">
				<i class="bi bi-pencil"></i>
			</button>
			<button class="btn btn-outline-danger" onclick="">
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

	node.appendChild(columnNode);
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
			clearContacts();
			loadNextContacts();
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

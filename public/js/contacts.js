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
		}
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
window.onscroll = function(ev) {
	if (!scrollTimeout && !doneLoadingAllContacts) {
		if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
			scrollTimeout = true;
			setTimeout(_ => {scrollTimeout = false;}, 100);
			loadNextContacts();
		}
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

clearContacts()
{
	document.getElementById("contacts-container").innerHTML = "";
}

let timeOutTimer;

function searchUpdate()
{
	clearTimeout(timeOutTimer);
	timeOutTimer = setTimeout(doSearch, 2000);
}

function doSearch()
{
	if(document.getElementById("searchbar").value === ""){
		boolSearchQuery = false;
	} else {
		boolSearchQuery = true;
		clearContacts();
		doneLoadingAllContacts = false;
		currentContactOffset = 0;
	}
	loadNextContacts();
}
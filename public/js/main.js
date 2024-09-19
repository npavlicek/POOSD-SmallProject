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

function confirmDelete() {
	let confirmAction = confirm("Are you sure you want to delete this?");
	if (confirmAction) {
		// Add deletetion of contact from the database
		alert("It works");
	}
}
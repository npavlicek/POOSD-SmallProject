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
			let found_prev_alerts = document.getElementsByClassName('collapse');
			if (found_prev_alerts.length > 0)
			{
				for (let i = 0; i < found_prev_alerts.length; i++)
				{
					bootstrap.Collapse.getInstance(found_prev_alerts[i]).hide();
				}
			}

			let wrapper = document.createElement("div");
			wrapper.classList.add('collapse', 'show');

			let errMsg = document.createElement("div");
			errMsg.classList.add('alert', 'alert-danger', 'mb-3');
			errMsg.innerText = "Login error: " + json.desc;

			let wrapper_collapse = new bootstrap.Collapse(wrapper, {
				toggle: false
			});

			wrapper.addEventListener('hidden.bs.collapse', event => {
				bootstrap.Collapse.getInstance(wrapper).dispose();
				wrapper.remove();
			});

			wrapper.appendChild(errMsg);
			document.body.firstElementChild.appendChild(wrapper);
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
			const errMsg = document.createElement("div");
			errMsg.id = "error_msg";
			errMsg.classList.add('alert', 'alert-danger');
			errMsg.innerText = "Registration error: " + json.desc;
			document.body.firstElementChild.appendChild(errMsg);
		}
	}).catch(function(error) {
		console.log(error);
	});

	return false;
}

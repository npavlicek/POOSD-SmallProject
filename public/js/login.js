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
				errMsg.innerText = "Login Error: " + json.desc;

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
			successMsg.innerText = "Successfully Registered ";

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
				errMsg.innerText = "Registration Error: " + json.desc;

				wrapper.appendChild(errMsg);
				document.body.firstElementChild.appendChild(wrapper);
			}
		}
	}).catch(function(error) {
		console.log(error);
	});

	return false;
}

// Quick Validation Tests for Password and Username
// function validatePassword(password)
// {
// 	const passwordPattern = /^[0-9a-zA-Z!@#$%^&*()]{6,20}$/;
// 	let check = password.replaceAll(" ", '');
// 	if(!passwordPattern.test(password))
// 	{

// 	}
// 	else if(check === "")
// 	{

// 	}
// 	else if(!/[A-Z]/g.test(password))
// 	{

// 	}
// 	else if(!/[a-z]/g.test(password))
// 	{

// 	}
// 	else if(!/[!@#$%^&*()]/g.test(password))
// 	{

// 	}
// 	else if(!/[0-9]/g.test(password))
// 	{

// 	}
// 	else if(password.length < 6)
// 	{

// 	}
// 	else if(password.length > 20)
// 	{

// 	}
//	else
//	{

//	}
// }

// function validateUsername(username)
// {
// 	const usernamePattern = /^[0-9a-zA-Z!@#$%^&*()]{6,20}$/;
// 	let check = username.replaceAll(" ", '');
// 	if(!usernamePattern.test(username))
// 	{
// 		if(username.length < 6){

// 		}
// 		else if(username.length > 20){
// 		}
// 		else
// 		{

// 		}
		
// }
// 	else if(check === "")
// 	{

//	}
//	else
//	{

//	}
// }


// Quick First Name & Last Name Checks to Have Input

// function firstNameCheck(first_name)
// {
// 	const firstnamePattern = /^[a-zA-Z0-9!$#-]{1,}$/g;
// 	let check = first_name.replaceAll(" ", '');
// 	if(!firstnamePattern.test(first_name))
// 	{
// 		// Wrong Formating
// 	}
// 	else if(check === "")
// 	{
// 		// Empty
// 	}
//	else
//	{

//	}
// }

// function lastNameCheck(last_name)
// {
// 	const lastnamePattern = /^[a-zA-Z0-9!$#-]{0,}$/g;
// 	if(!lastnamePattern.test(last_name))
// 	{
// 		// Wrong Formating
// 	}
//	else
//	{

//	}
// }
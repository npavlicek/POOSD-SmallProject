<!DOCTYPE html>
<html lang="en">
<header>
    <title>Contacts Login</title>
    <script src="/js/index.js"></script>
</header>

<body>
    <div id="loginBox">
        <h1>Login to Account</h1>
        <div><input type="text" placeholder="Username" id="loginUsername"></div>
        <div id="loginUsernameError"></div>
        <div><input type="text" placeholder="Password" id="loginPassword"></div>
        <div id="loginPasswordError"></div>
        <div><button onclick="doLogin()">Login</button></div>
        <div><button onclick="toRegister()">Register Account</button></div>
        <div id="loginResults"></div>
    </div>
    <div id="registerBox" hidden>
        <h2>Register a New Account</h2>
        <div><input id="first_name" placeholder="First Name"></div>
        <div><input id="last_name" placeholder="Last Name"></div>
        <div><input id="newUsername" placeholder="Username"></div>
        <div id="registerUsernameError"></div>
        <div><input id="newPassword" placeholder="Password"></div>
        <div id="registerPasswordError"></div>
        <div><button onclick="doRegister()">Create Account</button></div>
        <div id="registerResults"></div>
    </div>
</body>

</html>

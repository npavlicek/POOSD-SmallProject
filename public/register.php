<?php

session_start();

if (!$_SESSION['logged_in']) {
?>

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <title>Contact App Registration</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    </head>

    <body style="background-image: url('https://hmnh.harvard.edu/sites/hwpi.harvard.edu/files/styles/os_files_xxlarge/public/hmnh/files/sharks-poster-22-07-05.jpg?m=1666199614&itok=cXIwKTb8'); background-attachment: fixed; background-size: cover;">
        <div class="container mt-5 card">
            <form class="p-1" onsubmit="return doRegister();">
                <div class="mb-3 form-floating">
                    <input type="text" class="form-control" id="first_name" placeholder="First Name">
                    <label for="first_name" class="form-label"><b>First Name</b></label>
                </div>
                <div class="mb-3 form-floating">
                    <input type="text" class="form-control" id="last_name" placeholder="Last Name">
                    <label for="last_name" class="form-label"><b>Last Name</b></label>
                </div>
                <div class="mb-3 form-floating">
                    <input type="text" class="form-control" id="username" placeholder="Username">
                    <label for="username" class="form-label"><b>Username</b></label>
                </div>
                <div class="mb-3 form-floating">
                    <input type="password" class="form-control" id="password" placeholder="Password">
                    <label for="password" class="form-label"><b>Password</b></label>
                </div>
                <button id="register_button" type="submit" class="btn btn-primary">Register</button>
            </form>
            <p class="mt-3"> <b>Already signed up?</b> <a href="/login.php"><b>Sign in here</b></a></p>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        <script src="/js/login.js"></script>
    </body>

    </html>

<?php
} else {
    header('Location: /');
}
?>

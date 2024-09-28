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

    <body>
        <div class="card container mt-5 rounded-3">
            <form onsubmit="return doRegister();" class="row g-3">
                <div class="p-1 col-md-6">
                    <label for="first_name" class="form-label">First Name</label>
                    <input type="text" class="form-control border rounded-3" id="first_name">
                </div>
                <div class="p-1 col-md-6">
                    <label for="last_name" class="form-label">Last Name</label>
                    <input type="text" class="form-control border rounded-3" id="last_name">
                </div>
                <div class="p-1 col-md-6">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control border rounded-3" id="username">
                </div>
                <div class="p-1 col-md-6">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control border rounded-3" id="password">
                </div>
                <div class="p-1 col-12 mt-2">
                    <button id="register_button" type="submit" class="btn btn-primary rounded-3">Register</button>
                </div>
            </form>
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

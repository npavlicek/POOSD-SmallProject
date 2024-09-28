<?php
session_start();

if (!$_SESSION['logged_in']) {
?>

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <title>Contact App Login</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    </head>

    <body>
        <div class="card container mt-5 rounded-3">
            <form onsubmit="return doLogin();" class="row g-3">
                <div class="p-2 col-md-6">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control border rounded-3" id="username">
                </div>
                <div class="p-2 col-md-6">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control border rounded-3" id="password">
                </div>
                <div class="p-3 col-1">
                    <button type="submit" class="btn btn-primary rounded-3">Sign In</button>
                </div>
            </form>
            <!-- <p class="mt-3">Not signed up yet? <a href="/register.php">Sign up here</a>
            </p> -->
        </div>
        <div class="container mt-3">Not signed up yet? <button href="/register.php" class="btn btn-secondary rounded-3">Sign up Here</button></div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        <script src="/js/login.js"></script>
    </body>

    </html>

<?php
} else {
    header('Location: /');
}
?>

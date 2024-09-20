<?php

session_start();

if ($_SESSION['logged_in']) {
?>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <title>Contact App</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <link rel="stylesheet" href="css/styles.css">
    </head>

    <body>
        <div class="container mt-5">
            <?php
            echo '<h1 class="pt-5"><b>Welcome ' . $_SESSION['first_name'] . ' ' . $_SESSION['last_name'] . '</b>!</h1>';
            ?>

            <a href="/logout.php" class="mt-3">Logout</a>
            <h1 class="text-center mb-5">Contact List</h1>

            <div>
                <button class="new-button-contact" onclick=""> + Create New Contact</button>
            </div>

            <div id="contacts-container" class="row row-cols-3">
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        <script src="/js/contacts.js"></script>
    </body>

    </html>
<?php
} else {
    header('Location: /');
}
?>

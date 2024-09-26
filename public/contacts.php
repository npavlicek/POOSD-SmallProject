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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    </head>

    <body>
        <div class="container-fluid mt-2">
            <div class="row vh-100">
                <div class="col-2">
                    <?php
                    echo '<h3>Welcome <br><b>' . $_SESSION['first_name'] . ' ' . $_SESSION['last_name'] . '</b>!</h3>';
                    ?>
                    <a href="/logout.php" class="mt-3">Logout</a>
                    <br>
                    <button id="create-contact-button" class="btn btn-primary" onclick="addContactBegin();">Create Contact</button>
                    <input type="text" aria-label="Search for Contact" placeholder="Search contacts..." class="form-control" id="searchbar" oninput="searchUpdate()">
                </div>

                <div class="col mh-100">
                    <div id="contacts-container" class="row row-cols-4 mh-100" style="overflow-y: scroll;">
                    </div>
                </div>
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

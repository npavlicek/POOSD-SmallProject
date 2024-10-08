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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    </head>

    <body style="background-image: url('https://hmnh.harvard.edu/sites/hwpi.harvard.edu/files/styles/os_files_xxlarge/public/hmnh/files/sharks-poster-22-07-05.jpg?m=1666199614&itok=cXIwKTb8'); background-attachment: fixed; background-size: cover;">
        <div class="container-fluid">
            <div class="row vh-100">
                <div class="card p-3 col-2 mt-2 mx-auto" style="background-color: rgba(255,255,255,0.5)">
                    <?php
                    echo '<h3 class="mx-auto">Welcome <br><b>' . $_SESSION['first_name'] . ' ' . $_SESSION['last_name'] . '</b>!</h3>';
                    ?>
                    <div class="vstack gap-2 col-md mx-auto">
                        <button id="create-contact-button" class="btn btn-primary rounded-3" onclick="addContactBegin();">Create Contact</button>
                        <input type="text" aria-label="Search for Contact" placeholder="Search Contacts..." class="form-control rounded-3" id="searchbar" oninput="searchUpdate()">
                        <a href="/logout.php" class="btn btn-secondary mt-3 rounded-3">Logout</a>
                        <div style="height: 100px;"></div>
                        <h2 class="mx-auto"><b>About Us</b></h2>
                        <h4 class="mx-auto">Project Manager / Database</h4>
                        <p>Niko Pavlicek</p>
                        <h4 class="mx-auto">API</h4>
                        <p>Ernesto Suarez</p>
                        <p>Charles Longo</p>
                        <p>Evan Graff</p>
                        <h4 class="mx-auto">Front End</h4>
                        <p>Austin Chenoweth</p>
                        <p>Andres Abrams</p>
                    </div>
                </div>

                <div class="col mh-100">
                    <div id="contacts-container" class="row row-cols-4 mh-100" style="overflow-y: scroll;">
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="deleteContactModal" tabindex="-1" aria-labelledby="deleteContactModal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Confirm Deletion</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" onclick="deleteContactConfirm();">Delete</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
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

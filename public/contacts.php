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
        <style>
            
        </style>
    </head>

    <body>

    <div class="container">
        <?php
        echo '<h1 class="pt-5"><b>Welcome ' . $_SESSION['first_name'] . ' ' . $_SESSION['last_name'] . '</b>!</h1>';
        ?>
        <a href="/logout.php" class="mt-3">Logout</a>
    </div>

    

    <!-- ChatGPT helped me create the boxes -->
    <div class="container mt-5">
        <h1 class="text-center mb-5">Contact List</h1>
        
        <div>
            <button class="new-button-contact" onclick=""> + Create New Contact</button>
        </div>

        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card contact-card">
                    <div class="card-body">
                        <h5 class="card-title"> Andrew Victor</h5>
                        <p class="card-text increase-top-gap reduce-bottom-gap">xyz@gmail.com</p>
                        <p class="card-text">786-928-9472</p>
                        <div class="image-link">
                            <!-- Delete button -->
                            <img src="https://pngimg.com/d/trash_can_PNG18460.png" class="red-background" alt="Trash Can" onclick="confirmDelete()">
                            <!-- Edit button -->
                            <img src="https://www.clipartmax.com/png/small/351-3513671_revise-icon-transparent-background-editing-icon.png" class="blue-background" alt="Edit">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="/js/main.js"></script>
    </body>
    </html>


<?php
} else {
    header('Location: /');
}
?>

<?php

session_start();

if ($_SESSION['logged_in']) {
    header('Location: /contacts.php');
} else {
    header('Location: /login.php');
}

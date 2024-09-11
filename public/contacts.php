<!DOCTYPE html>
<html>
<header>
    <title>Contacts Page</title>
    <script src="/js/contacts.js"></script>
    <script onload="startLoadContacts()"></script>
</header>

<body>
    <h1>Contact List</h1>
    <div id="errorMessage"></div>
    <div><input id="search" placeholder="Search"></div>
    <div><button onclick="doSearch()">Search for Contact</button></div>
    <div><button onclick="addContactInput()" id="createContactButton">Create a new Contact</button></div>
    <div id="createContact" hidden>
        <div><input id="new_first_name" placeholder="Contact First Name"></div>
        <div><input id="new_last_name" placeholder="Contact Last Name"></div>
        <div><input id="new_phone_number" placeholder="Contact Phone Number"></div>
        <div><input id="new_email" placeholder="Contact Email"></div>
        <div><button onclick="addContact()">Create Contact</button></div>
    </div>
    <div id="Contacts?"></div>
</body>

</html>

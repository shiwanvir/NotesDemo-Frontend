//this will get trigger after html loads, not wating to load external libraries to laod
document.addEventListener('DOMContentLoaded', function () {
    //carate const variable for base url
    const baseUrl = 'http://localhost:8080/';
    //from elements
    var noteForm = document.getElementById('note_form');
    var submitButton = document.getElementById('submit_button');
    var cancelButton = document.getElementById('cancel_button');
    //table elements
    var notesTable = document.getElementById('notes-table');
    var emptyTableMessage = document.getElementById('empty-table-message');
    var notesTableBody = document.querySelector('#notes-table tbody')

    //getting fired when shubmit button hits
    noteForm.addEventListener('submit', function (event) {
        //prevent default form submission(page relod)
        event.preventDefault()
        //get form filed attribute values
        var noteId = document.getElementById('id').value;
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        //create note object
        var noteObject = {
            'id': noteId,
            'title': title,
            'description': description
        };
        //check note already have an id if not, will create a new note
        if (validateformFileds()) {
            if (noteId == '') {
                saveNote(noteObject)
            }
            else {
                updateNote(noteObject)
            }
        }

    })
    //cancel button event listner
    cancelButton.addEventListener('click', function (event) {
        noteForm.reset()
        submitButton.innerText = 'Save';
    });

    //load note list 
    function loadNoteTable() {
        fetch(baseUrl + 'notes')
            .then(response => {
                //if request fails
                if (!response.ok) {
                    console.log(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {

                notesTable.style.display = data.data !== null ? 'inline-block' : 'none';
                emptyTableMessage.style.display = data.data !== null ? 'none' : 'block';
                //clear curret table
                notesTableBody.innerHTML = '';
                //loop through data object
                data.data.forEach(function (note) {
                    //create new table raw for each object
                    var new_row = notesTableBody.insertRow();
                    //pupulate raw data
                    new_row.insertCell(0).textContent = note.id;
                    new_row.insertCell(1).textContent = note.title;
                    new_row.insertCell(2).textContent = note.description;

                    //Crate action buttons
                    var actionsCell = new_row.insertCell(3);
                    var updateButton = document.createElement('button');
                    updateButton.textContent = 'Edit';
                    //adding class for edit button dynamically
                    updateButton.classList.add('edit-button');
                    updateButton.addEventListener('click', function () {
                        // Handle update button click
                        handleEditButton(note);
                    });
                    //appending edit button into cell
                    actionsCell.appendChild(updateButton);

                    var deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    //adding class for edit button dynamically
                    deleteButton.classList.add('delete-button');
                    deleteButton.addEventListener('click', function () {
                        // Handle delete button click
                        handleDeleteButton(note);
                    });
                    //appending delete button into cell
                    actionsCell.appendChild(deleteButton);


                })
            })
            .catch(error => {
                //show empty table message
                emptyTableMessage.style.display = 'block';
                console.log('Error fetching notes:', error);

            });
    }

    //calling load note list function
    loadNoteTable();

    //edit note
    function handleEditButton(note) {
        // Populate the form with the selected note for updating
        document.getElementById('id').value = note.id;
        document.getElementById('title').value = note.title;
        document.getElementById('description').value = note.description;
        submitButton.innerText = 'Update';

    }
    //delete note
    function handleDeleteButton(note) {
        var confirmation = confirm("Are you sure you want to delete note!");
        if (confirmation) {
            deleteNote(note)
            loadNoteTable()
        }
    }
    //save note
    function saveNote(noteObject) {
        fetch(baseUrl + 'notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteObject)

        }).then(response => response.json())
            .then(data => {
                //if sucessfully saved
                alert("Note Sucessfully Saved");
                noteForm.reset();
                loadNoteTable();

            })
            .catch(error => {
                alert("Note Saving Failed")
            });

    }
    //update note
    function updateNote(noteObject) {
        fetch(baseUrl + 'update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteObject)

        }).then(response => response.json())
            .then(data => {
                //if sucessfully updated
                alert("Note Sucessfully Updated");
                noteForm.reset();
                document.getElementById('id').value = "";
                submitButton.innerText = 'Save';
                loadNoteTable();

            })
            .catch(error => {
                alert("Note Saving Failed")
            });

    }
    //delete note
    function deleteNote(noteObject) {
        fetch(`${baseUrl}delete/${noteObject.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteObject)

        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
            .then(data => {
                //if sucessfully deleted
                alert(JSON.parse(data).message);
                loadNoteTable();
            })
            .catch(error => {
                alert("Note Deletion Failed");
            });

    }
    //validate form fields
    function validateformFileds() {
        var title = document.getElementById('title').value.trim();
        var description = document.getElementById('description').value.trim();
        if (title === "") {
            alert("Please Enter a title");
            return false;
        }
        else if (description === "") {
            alert("Please Enter Description");
            return false;
        }
        else {
            return true
        }
    }


});
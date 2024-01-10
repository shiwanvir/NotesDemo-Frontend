document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = 'http://localhost:8080/';
    var noteForm = document.getElementById('note_form');
    var submitButton = document.getElementById('submit_button');
    var cancelButton = document.getElementById('cancel_button');
    var notesTable = document.getElementById('notes-table');
    var emptyTableMessage = document.getElementById('empty-table-message');
    var notesTableBody = document.querySelector('#notes-table tbody')


    noteForm.addEventListener('submit', function (event) {
        //prevent default form submission
        event.preventDefault()
        //get form attribute values
        var noteId = document.getElementById('id').value;
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;

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

    cancelButton.addEventListener('click', function (event) {
        noteForm.reset()
        submitButton.innerText = 'Save';
    });

    function loadNoteTable() {
        fetch(baseUrl + 'notes')
            .then(response => {
                if (!response.ok) {
                    //throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //clear curret table
                notesTable.style.display = data.data !== null ? 'inline-block' : 'none';
                emptyTableMessage.style.display = data.data !== null ? 'none' : 'block';
                notesTableBody.innerHTML = '';
                data.data.forEach(function (note) {
                    var new_row = notesTableBody.insertRow();
                    //pupulate raw data
                    new_row.insertCell(0).textContent = note.id;
                    new_row.insertCell(1).textContent = note.title;
                    new_row.insertCell(2).textContent = note.description;

                    //Crate action buttons
                    var actionsCell = new_row.insertCell(3);
                    var updateButton = document.createElement('button');
                    updateButton.textContent = 'Edit';
                    updateButton.classList.add('edit-button');
                    updateButton.addEventListener('click', function () {
                        // Handle update button click
                        handleEditButton(note);
                    });
                    actionsCell.appendChild(updateButton);

                    var deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-button');
                    deleteButton.addEventListener('click', function () {
                        // Handle delete button click
                        handleDeleteButton(note);
                    });
                    actionsCell.appendChild(deleteButton);


                })
            })
            .catch(error => {
                emptyTableMessage.style.display = 'block';
                console.log('Error fetching notes:', error);

            });
    }


    loadNoteTable();

    function handleEditButton(note) {
        // Populate the form with the selected note for updating
        document.getElementById('id').value = note.id;
        document.getElementById('title').value = note.title;
        document.getElementById('description').value = note.description;
        submitButton.innerText = 'Update';

    }

    function handleDeleteButton(note) {
        var confirmation = confirm("Are you sure you want to delete note!");
        if (confirmation) {
            deleteNote(note)
            loadNoteTable()
        }
    }

    function saveNote(noteObject) {
        fetch(baseUrl + 'notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteObject)

        }).then(response => response.json())
            .then(data => {
                alert("Note Sucessfully Saved");
                noteForm.reset();
                loadNoteTable();

            })
            .catch(error => {
                alert("Note Saving Failed")
            });

    }

    function updateNote(noteObject) {
        fetch(baseUrl + 'update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteObject)

        }).then(response => response.json())
            .then(data => {
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

                alert(JSON.parse(data).message);
                loadNoteTable();
            })
            .catch(error => {
                alert("Note Deletion Failed");
            });

    }

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
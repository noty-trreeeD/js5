const notesContainer = document.querySelector(".notes");
const noteTextInput = document.querySelector(".note textarea");
const noteCounter = document.querySelector(".note .note__footer .label");
const progress = document.querySelector(".note .progress-bar .inner-bar");
const saveBtn = document.querySelector(".note .note__footer .note__save");

const notesList = JSON.parse(localStorage.getItem("notes")) || [];

for (const noteText of notesList) {
    const newNote = buildNote(noteText);
    notesContainer.insertBefore(newNote, noteTextInput.parentNode);
}

noteTextInput.oninput = () => {
    const noteText = noteTextInput.value;
    noteCounter.textContent = `${100 - noteText.length} left`;
    progress.style.transform = `translateX(-${noteText.length}%)`;
};

function buildNote(text) {
    const note = document.createElement("div");
    note.className = "note";

    const noteBody = document.createElement("div");
    noteBody.className = "note__body";
    noteBody.textContent = text;
    noteBody.contentEditable = false;

    const noteFooter = document.createElement("div");
    noteFooter.className = "note__footer";
    noteFooter.style.justifyContent = "flex-end";

    const editBtn = document.createElement("button");
    editBtn.className = "note__edit";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => toggleEditMode(note, noteBody, editBtn, text);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "note__delete";
    deleteBtn.textContent = "Remove";
    deleteBtn.onclick = () => deleteNote(note, text);

    const copyBtn = document.createElement("button");
    copyBtn.className = "note__copy";
    copyBtn.textContent = "Copy";
    copyBtn.onclick = () => copyNote(text);

    noteFooter.append(editBtn, copyBtn, deleteBtn);
    note.append(noteBody, noteFooter);

    return note;
}

function toggleEditMode(note, noteBody, editBtn, oldText) {
    if (editBtn.textContent === "Edit") {
        noteBody.contentEditable = true;
        noteBody.focus();
        note.classList.add("editing");
        editBtn.textContent = "Save";
    } else {
        const newText = noteBody.textContent.trim();
        if (!newText) return;

        const index = notesList.indexOf(oldText);
        if (index > -1) {
            notesList[index] = newText;
            localStorage.setItem("notes", JSON.stringify(notesList));
        }

        noteBody.contentEditable = false;
        note.classList.remove("editing");
        editBtn.textContent = "Edit";
    }
}

function deleteNote(noteElement, noteText) {
    const index = notesList.indexOf(noteText);
    if (index > -1) {
        notesList.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notesList));
    }
    noteElement.remove();
}

function copyNote(originalText) {
    const copiedText = `(Copy) ${originalText}`;
    const newNote = buildNote(copiedText);
    notesContainer.insertBefore(newNote, noteTextInput.parentNode);
    notesList.push(copiedText);
    localStorage.setItem("notes", JSON.stringify(notesList));
}

saveBtn.onclick = () => {
    const noteText = noteTextInput.value.trim();
    if (!noteText) return;

    const newNote = buildNote(noteText);
    notesContainer.insertBefore(newNote, noteTextInput.parentNode);
    notesList.push(noteText);
    localStorage.setItem("notes", JSON.stringify(notesList));

    noteTextInput.value = "";
    noteTextInput.focus();
    noteCounter.textContent = "100 left";
    progress.style.transform = `translateX(0%)`;
};

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

    const noteFooter = document.createElement("div");
    noteFooter.className = "note__footer";
    noteFooter.style.justifyContent = "flex-end";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "note__delete";
    deleteBtn.textContent = "Remove";
    deleteBtn.onclick = () => deleteNote(note, text); // Добавляем обработчик

    const copyBtn = document.createElement("button");
    copyBtn.className = "note__copy";
    copyBtn.textContent = "Copy";
    copyBtn.onclick = () => copyNote(text); // Добавляем обработчик

    noteFooter.append(copyBtn, deleteBtn);
    note.append(noteBody, noteFooter);

    return note;
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

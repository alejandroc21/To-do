import "./style.css";

const modal = document.getElementById("modal");
const addBtn = document.querySelector(".add-btn");
const applyBtn = document.querySelector(".btn-apply");
const cancelBtn = document.querySelector(".btn-cancel");
const listContainer = document.querySelector(".list-container");
const modalInput = document.querySelector(".modal-input");
const themeBtn = document.querySelector(".theme-btn");
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
}

addBtn.addEventListener("click", () => showModal());
themeBtn.addEventListener("click", () => toggleTheme());
listContainer.addEventListener("click", (e) => {
  const item = e.target.closest(".todo-item");
  if (!item) return;
  const id = item.dataset.id;

  if (e.target.closest(".delete-btn")) deleteNote(id);
  if (e.target.closest(".todo-checkbox")) noteCompleted(id);
  if (e.target.closest(".edit-btn")) editNote(item);
  if (e.target.closest(".save-edit-btn")) saveEditedNote(item);
  if (e.target.closest(".cancel-edit-btn")) item.classList.remove("editing");
});

cancelBtn.addEventListener("click", () => closeModal());
applyBtn.addEventListener("click", () => addNote());
modalInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
});

class Note {
  constructor(text, completed) {
    this.id = crypto.randomUUID();
    this.text = text;
    this.completed = completed;
    this.createdAt = Date.now();
  }
}

let notes = [];

renderNotes();

function showModal() {
  modal.classList.add("active");
  modalInput.focus();
}

function closeModal() {
  modal.classList.remove("active");
}

function renderNotes() {
  restoreNotes();
  listContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  notes.forEach((note) => {
    const item = document.createElement("div");
    item.className = "todo-item";
    item.dataset.id = note.id;
    item.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${note.completed ? "checked" : ""}>
                <span class="todo-text">${note.text}</span>
                <input type="text" class="todo-edit-input" value="${note.text}">
                <div class="todo-actions">
                    <button class="edit-btn action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                        </svg>
                    </button>
                    <button class="delete-btn action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                    </button>
                    <button class="save-edit-btn action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                        </svg>
                    </button>

                    <button class="cancel-edit-btn action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </button>
                </div>
            `;
    fragment.appendChild(item);
  });

  listContainer.appendChild(fragment);
}

function addNote() {
  const text = modalInput.value.trim();
  if (text === "") return;

  notes.unshift(new Note(text, false));
  saveNotes();
  renderNotes();
  modalInput.value = "";
  closeModal();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id != id);
  saveNotes();
  renderNotes();
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function restoreNotes() {
  if (!localStorage.getItem("notes")) return;
  notes = JSON.parse(localStorage.getItem("notes"));
}

function toggleTheme() {
  let theme = document.documentElement.getAttribute("data-theme", currentTheme);

  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}

function noteCompleted(noteId) {
  notes = notes.map((n) => {
    if (n.id === noteId) {
      return { ...n, completed: !n.completed };
    }
    return n;
  });
  saveNotes();
}

function editNote(note) {
  note.classList.add("editing");
  const input = note.querySelector(".todo-edit-input");
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function saveEditedNote(note) {
  const input = note.querySelector(".todo-edit-input");
  const text = input.value.trim();

  if (text !== "") {
    notes = notes.map((n) => {
      if (n.id === note.dataset.id) {
        return {...n, text: text}
      }
      return n;
    });

    saveNotes();
    renderNotes();
  }

  note.classList.remove("editing");
}

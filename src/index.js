import "./style.css";

const modal = document.getElementById('modal');
const addBtn = document.querySelector('.add-btn');
const applyBtn = document.querySelector('.btn-apply')
const cancelBtn = document.querySelector('.btn-cancel');
const listContainer = document.querySelector('.list-container');
const modalInput = document.querySelector('.modal-input');


addBtn.addEventListener('click', () => showModal());
listContainer.addEventListener('click', (e)=> {
    if(e.target.classList.contains('delete-btn')){
        const id = e.target.closest('.todo-item').dataset.id;
        deleteNote(id);
    }   
});

cancelBtn.addEventListener('click', ()=>closeModal());
applyBtn.addEventListener('click', ()=> addNote());
modalInput.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
         addNote();
    }
});

class Note{
    constructor(text, completed){
        this.id = crypto.randomUUID();
        this.text = text;
        this.completed = completed;
        this.createdAt = Date.now();
    }
}

let notes = [];
renderNotes();

function showModal(){
    modal.classList.add('active');
    modalInput.focus();
}

function closeModal(){
    modal.classList.remove('active');
}

function renderNotes(){
    restoreNotes();
    listContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    notes.forEach((note)=>{
        const item = document.createElement('div');
        item.className = 'todo-item';
        item.dataset.id = note.id;
        item.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${note.completed ? 'checked' : ''}>
                <span class="todo-text">${note.text}</span>
                <div class="todo-actions">
                    <button class="edit-btn action-btn">edit</button>
                    <button class="delete-btn action-btn">delete</button>
                </div>
            `; 

        fragment.appendChild(item);
    });
    listContainer.appendChild(fragment);
}

function addNote(){
    const text = modalInput.value.trim();
    if(text === '') return;

    notes.unshift(new Note(text, false));
    saveNotes();
    renderNotes();
    modalInput.value = '';
    closeModal();
}

function deleteNote(id){
    notes = notes.filter(note => note.id != id);
    saveNotes()
    renderNotes();
}

function saveNotes(){
        localStorage.setItem('notes', JSON.stringify(notes));
}

function restoreNotes(){
    if(!localStorage.getItem('notes')) return;
    
    notes = JSON.parse(localStorage.getItem('notes'))
}
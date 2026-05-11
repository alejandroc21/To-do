import "./style.css";

const modal = document.getElementById('modal');

const addBtn = document.querySelector('.add-btn');
const cancelBtn = document.querySelector('.btn-cancel');


addBtn.addEventListener('click', ()=>showModal());
cancelBtn.addEventListener('click', ()=>closeModal());


function showModal(){
    modal.classList.add('active');
}

function closeModal(){
    modal.classList.remove('active');
}
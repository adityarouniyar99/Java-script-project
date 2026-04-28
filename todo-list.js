const input = document.getElementById('todo-input');
const priorityInput = document.getElementById('priority-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const progressBar = document.getElementById('progress-bar');
const progressPercentageText = document.getElementById('progress-percentage');

const saved = localStorage.getItem('todos');
let todos = saved ? JSON.parse(saved) : [];

// --- Past Dates Disable Logic ---
function disablePastDates() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    dateInput.setAttribute('min', minDate);
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateProgress();
}

function updateProgress() {
    if (todos.length === 0) {
        progressBar.style.width = "0%";
        progressPercentageText.innerText = "0%";
        return;
    }
    const completed = todos.filter(t => t.completed).length;
    const percent = Math.round((completed / todos.length) * 100);
    progressBar.style.width = percent + "%";
    progressPercentageText.innerText = percent + "%";
}

function createTodoNode(todo, index) {
    const li = document.createElement('li');
    li.className = `priority-${todo.priority}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    
    const textSpan = document.createElement("span");
    textSpan.innerHTML = `<strong>${todo.text}</strong><small>📅 ${todo.date || 'No Date'} | ⚡ ${todo.priority}</small>`;
    
    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        saveTodos();
        render(); 
    });

    textSpan.addEventListener("dblclick", () => {
        const newText = prompt("Edit task:", todo.text);
        if (newText) {
            todo.text = newText;
            saveTodos();
            render();
        }
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        saveTodos();
        render();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);
    return li;
}

function render() {
    list.innerHTML = '';
    todos.forEach((todo, index) => {
        const node = createTodoNode(todo, index);
        list.appendChild(node);
    });
    updateProgress();
}

function addTodo() {
    if (!input.value.trim()) return;
    
    todos.push({ 
        text: input.value, 
        completed: false,
        priority: priorityInput.value,
        date: dateInput.value
    });
    
    input.value = '';
    priorityInput.selectedIndex = 0; 
    dateInput.value = '';

    saveTodos();
    render();
}

// Modal Logic
const modal = document.getElementById("about-modal");
const aboutLink = document.getElementById("nav-about");
const closeBtn = document.querySelector(".close-btn");

aboutLink.onclick = (e) => { e.preventDefault(); modal.style.display = "flex"; }
closeBtn.onclick = () => { modal.style.display = "none"; }
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }

addBtn.addEventListener("click", addTodo);
input.addEventListener('keydown', (e) => { if (e.key == 'Enter') addTodo(); });

// Initial setup
disablePastDates();
render();
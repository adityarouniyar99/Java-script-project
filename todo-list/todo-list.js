// ... (Aapka purana code yaha tak same rahega) ...
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodoNode(todo, index) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    
    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text;
    
    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        saveTodos();
        // UI render handle karega strike-through
        render(); 
    });

    textSpan.addEventListener("dblclick", () => {
        const newText = prompt("Edit todo", todo.text);
        if (newText !== null) {
            todo.text = newText.trim();
            render();
            saveTodos();
        }
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        render();
        saveTodos();
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
}

function addTodo() {
    const text = input.value.trim();
    if (!text) return;
    todos.push({ text: text, completed: false });
    input.value = '';
    render();
    saveTodos();
}

addBtn.addEventListener("click", addTodo);
input.addEventListener('keydown', (e) => { if (e.key == 'Enter') addTodo(); });

// --- Naya Modal Logic ---
const modal = document.getElementById("about-modal");
const aboutLink = document.getElementById("nav-about");
const closeBtn = document.querySelector(".close-btn");

aboutLink.onclick = (e) => {
    e.preventDefault();
    modal.style.display = "flex";
}

closeBtn.onclick = () => { modal.style.display = "none"; }

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

render();
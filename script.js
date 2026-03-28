/**
 * SleekTasks - Modern To-Do List Application
 * Logic and State Management
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const itemsLeftCounter = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');

    // State
    let todos = JSON.parse(localStorage.getItem('sleek-tasks')) || [
        { id: 1, text: '🎉 Chào mừng đến với SleekTasks!', completed: false },
        { id: 2, text: '✏️ Nhấn vào văn bản để chỉnh sửa hoặc nhấn dấu tích để hoàn thành.', completed: true }
    ];
    let currentFilter = 'all';

    // Initialize
    renderTodos();

    // Event Listeners
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            addTodo(text);
            todoInput.value = '';
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveAndRender();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update filter and re-render
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Core Functions
    function addTodo(text) {
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        todos.unshift(newTodo);
        saveAndRender();
    }

    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveAndRender();
    }

    function deleteTodo(id) {
        const element = document.querySelector(`.todo-item[data-id="${id}"]`);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                todos = todos.filter(todo => todo.id !== id);
                saveAndRender();
            }, 300);
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem('sleek-tasks', JSON.stringify(todos));
    }

    function renderTodos() {
        // Filter todos based on current state
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        // Render HTML
        todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            todoList.innerHTML = `<li class="todo-text" style="text-align: center; margin-top: 2rem; color: #64748b;">Chưa có công việc nào ở đây... ✨</li>`;
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.setAttribute('data-id', todo.id);
                
                li.innerHTML = `
                    <div class="checkbox-wrapper" onclick="handleToggle(${todo.id})">
                        <div class="custom-checkbox">
                            <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                        </div>
                    </div>
                    <span class="todo-text">${escapeHtml(todo.text)}</span>
                    <button class="delete-btn" onclick="handleDelete(${todo.id})">
                        <i data-lucide="trash-2" style="width: 1.2rem; height: 1.2rem;"></i>
                    </button>
                `;
                todoList.appendChild(li);
            });
        }

        // Update stats
        const activeCount = todos.filter(todo => !todo.completed).length;
        itemsLeftCounter.innerText = `${activeCount} công việc đang chờ`;

        // Refresh icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

        saveToLocalStorage();
    }

    function saveAndRender() {
        saveToLocalStorage();
        renderTodos();
    }

    // Utility
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Expose handlers to global scope for onclick attributes
    window.handleToggle = toggleTodo;
    window.handleDelete = deleteTodo;
});

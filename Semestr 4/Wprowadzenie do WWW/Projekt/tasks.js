document.addEventListener('DOMContentLoaded', () => {
	fetchTasks();
	document.getElementById('task-form').addEventListener('submit', addTask);
	document.getElementById('edit-form').addEventListener('submit', saveEdit);
});

const apiUrl = 'http://localhost:3000/tasks';
let editingTaskId = null;

const fetchTasks = async () => {
	const response = await fetch(apiUrl);
	const tasks = await response.json();
	renderTasks(tasks);
};

const addTask = async (event) => {
	event.preventDefault();
	const name = document.getElementById('task-name').value;
	const priority = document.getElementById('task-priority').value;

	const newTask = { name, priority, completed: false };

	await fetch(apiUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(newTask),
	});

	fetchTasks();
	document.getElementById('task-form').reset();
};

const deleteTask = async (id) => {
	await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
	fetchTasks();
};

const editTask = async (id) => {
	editingTaskId = id;
	const response = await fetch(`${apiUrl}/${id}`);
	const task = await response.json();
	document.getElementById('edit-task-name').value = task.name;
	document.getElementById('edit-task-priority').value = task.priority;
	document.getElementById('edit-dialog').showModal();
};

const saveEdit = async (event) => {
	event.preventDefault();
	const name = document.getElementById('edit-task-name').value;
	const priority = document.getElementById('edit-task-priority').value;

	await fetch(`${apiUrl}/${editingTaskId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, priority, completed: false }),
	});

	fetchTasks();
	closeDialog();
};

const closeDialog = () => document.getElementById('edit-dialog').close();

const toggleComplete = async (id, completed) => {
	await fetch(`${apiUrl}/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ completed }),
	});

	fetchTasks();
};

const renderTasks = (tasks) => {
	const taskList = document.getElementById('task-list');
	taskList.innerHTML = '';
	tasks.forEach((task) => {
		const li = document.createElement('li');
		li.className = `task ${task.priority} ${task.completed ? 'completed' : ''}`;
		li.innerHTML = `
            <span>${task.name}</span>
            <div>
                <button onclick="toggleComplete(${task.id}, ${!task.completed})">${
			task.completed ? 'Oznacz jako niezrobione' : 'Oznacz jako zrobione'
		}</button>
                <button onclick="editTask(${task.id})">Edytuj</button>
                <button onclick="deleteTask(${task.id})">Usuń</button>
            </div>
        `;

		taskList.appendChild(li);
	});
};

const sortTasks = (criteria) => {
	fetch(apiUrl)
		.then((response) => response.json())
		.then((tasks) => {
			if (criteria === 'alphabetical') {
				tasks.sort((a, b) => a.name.localeCompare(b.name));
			} else if (criteria === 'status') {
				tasks.sort((a, b) => a.completed - b.completed || a.name.localeCompare(b.name));
			}

			renderTasks(tasks);
		});
};

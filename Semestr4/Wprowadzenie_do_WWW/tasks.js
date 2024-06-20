document.addEventListener('DOMContentLoaded', () => {
	fetchTasks();
	document.getElementById('task-form').addEventListener('submit', addTask);
	document.getElementById('edit-form').addEventListener('submit', saveEdit);
});

const apiUrl = 'http://localhost:3000/tasks';
let editingTaskId = null;

const nameError = document.getElementById('name-error');
const editNameError = document.getElementById('edit-name-error');
const priorityError = document.getElementById('priority-error');
const editPriorityError = document.getElementById('edit-priority-error');
const otherError = document.getElementById('other-error');
const editOtherError = document.getElementById('edit-other-error');

const fetchTasks = async () => {
	try {
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const tasks = await response.json();
		renderTasks(tasks);
	} catch (error) {
		displayErrorMessage(otherError, 'Wystąpił błąd przy pobieraniu zadań.');
	}
};

const addTask = async (event) => {
	event.preventDefault();
	const name = document.getElementById('task-name').value.trim();
	const priority = document.getElementById('task-priority').value;

	if (name.length < 2) {
		displayErrorMessage(nameError, 'Nazwa zadania musi mieć co najmniej 2 znaki', false);
		return;
	} else {
		clearErrorMessage(nameError);
	}

	if (priority === 'none') {
		displayErrorMessage(priorityError, 'Wybierz priorytet', false);
		return;
	} else {
		clearErrorMessage(priorityError);
	}

	const newTask = { name, priority, completed: false };

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newTask),
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		fetchTasks();
		document.getElementById('task-form').reset();
		clearErrorMessage(otherError);
	} catch (error) {
		displayErrorMessage(otherError, 'Wystąpił błąd przy dodawaniu zadania.');
	}
};

const deleteTask = async (id) => {
	try {
		const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		fetchTasks();
	} catch (error) {
		displayErrorMessage(otherError, 'Wystąpił błąd przy usuwaniu zadania.');
	}
};

const editTask = async (id) => {
	editingTaskId = id;
	try {
		const response = await fetch(`${apiUrl}/${id}`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const task = await response.json();
		document.getElementById('edit-task-name').value = task.name;
		document.getElementById('edit-task-priority').value = task.priority;
		document.getElementById('edit-dialog').showModal();
	} catch (error) {
		displayErrorMessage(otherError, 'Wystąpił błąd przy edytowaniu zadania.');
	}
};

const saveEdit = async (event) => {
	event.preventDefault();
	const name = document.getElementById('edit-task-name').value.trim();
	const priority = document.getElementById('edit-task-priority').value;

	if (name.length < 2) {
		displayErrorMessage(editNameError, 'Nazwa zadania musi mieć co najmniej 2 znaki', false);
		return;
	} else {
		clearErrorMessage(editNameError);
	}

	if (priority === 'none') {
		displayErrorMessage(editPriorityError, 'Wybierz priorytet'), false;
		return;
	} else {
		clearErrorMessage(editPriorityError);
	}

	try {
		const response = await fetch(`${apiUrl}/${editingTaskId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, priority, completed: false }),
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		fetchTasks();
		closeDialog();
		clearErrorMessage(editOtherError);
	} catch (error) {
		displayErrorMessage(editOtherError, 'Wystąpił błąd przy zapisywaniu zadania.');
	}
};

const closeDialog = () => document.getElementById('edit-dialog').close();

const toggleComplete = async (id, completed) => {
	try {
		const response = await fetch(`${apiUrl}/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ completed }),
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		fetchTasks();
	} catch (error) {
		displayErrorMessage(otherError, 'Wystąpił błąd przy aktualizowaniu statusu zadania.');
	}
};

const renderTasks = (tasks) => {
	const taskList = document.getElementById('task-list');
	taskList.innerHTML = '';

	tasks.forEach((task) => {
		const li = document.createElement('li');
		li.className = `task ${task.priority} ${task.completed ? 'completed' : ''}`;
		li.innerHTML = `
            <span>${task.name}</span>
            <div class='task-actions'>
                <button class='task-action-btn task-check-btn' aria-label="${
									task.completed ? 'Undo task' : 'Complete task'
								}" onclick="toggleComplete(${task.id}, ${!task.completed})">
                    <i class="${task.completed ? 'fas fa-undo' : 'fas fa-check'}"></i>
                </button>
                <button class='task-action-btn task-edit-btn' aria-label="Edit task" onclick="editTask(${
									task.id
								})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class='task-action-btn task-delete-btn' aria-label="Delete task" onclick="deleteTask(${
									task.id
								})">
                    <i class="fas fa-trash"></i>
                </button>
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
			} else if (criteria === 'priority') {
				tasks.sort((a, b) => {
					if (a.priority === 'high' && b.priority !== 'high') {
						return -1;
					} else if (a.priority !== 'high' && b.priority === 'high') {
						return 1;
					} else if (a.priority === 'medium' && b.priority === 'low') {
						return -1;
					} else if (a.priority === 'low' && b.priority === 'medium') {
						return 1;
					} else {
						return a.name.localeCompare(b.name);
					}
				});
			}

			renderTasks(tasks);
		});
};

const displayErrorMessage = (element, message, autoHide = true) => {
	element.textContent = message;

	if (autoHide) {
		setTimeout(() => {
			clearErrorMessage(element);
		}, 3000);
	}
};

const clearErrorMessage = (element) => {
	element.textContent = '';
};

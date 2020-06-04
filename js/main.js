; (function () {
	"use strict";

	let tasks = [
		{
			'name': 'React JS',
			'done': false
		},
		{
			'name': 'Drink BEER',
			'done': false
		},
		{
			'name': 'Relax',
			'done': true
		}
	];

	// localStorage.setItem('ba-todo', JSON.stringify(tasks));

	const form = document.querySelector('.ba-add-form');
	const taskTmpl = document.querySelector('[data-tmpl]').innerHTML;
	const todoList = document.querySelector('#todo-list');
	const completedList = document.querySelector('#completed-list');

	let tempTask = {
		name: '',
		done: false
	}

	function addTaskInStorage(task = '') {
		let storageTasks = localStorage.getItem('ba-todo');
		storageTasks = JSON.parse(storageTasks) || [];

		let newTaskObj = {
			'name': task,
			'done': false
		}
		storageTasks.push(newTaskObj);

		localStorage.setItem('ba-todo', JSON.stringify(storageTasks));
	}

	function removeTaskInStorage(task = '') {
		let storageTasks = localStorage.getItem('ba-todo');
		storageTasks = JSON.parse(storageTasks) || [];

		console.log(storageTasks);

		let updatedTasks = storageTasks.filter(item => {
			return item.name != task;
		});

		console.log(updatedTasks);

		localStorage.setItem('ba-todo', JSON.stringify(updatedTasks));
	}

	function updateTaskToggleInStorage(task = '') {
		let storageTasks = localStorage.getItem('ba-todo');
		storageTasks = JSON.parse(storageTasks) || [];

		console.log(storageTasks);

		let updatedTasks = storageTasks.filter(item => {
			return item.name != task;
		});

		let taskToUpdate = storageTasks.filter(item => {
			return item.name == task;
		});


		// console.log(taskToUpdate[0]);
		taskToUpdate[0].done = !taskToUpdate[0].done;
		// console.log(taskToUpdate[0]);

		updatedTasks.push(taskToUpdate[0]);

		localStorage.setItem('ba-todo', JSON.stringify(updatedTasks));
	}

	function updateTaskInStorage(taskInput) {

		if (taskInput.dataset.defValue != tempTask.name) {
			removeTaskInStorage(tempTask.name);
			let storageTasks = localStorage.getItem('ba-todo');
			storageTasks = JSON.parse(storageTasks) || [];

			console.log(storageTasks);

			let updatedTasks = storageTasks.filter(item => {
				return item.name != taskInput.value;
			});

			tempTask.name = taskInput.dataset.defValue;

			updatedTasks.push(tempTask);

			localStorage.setItem('ba-todo', JSON.stringify(updatedTasks));

		}

	}


	function addItem(event) {
		event.preventDefault();
		const newTask = this.elements.newtask; // this.elements - all form elemtns

		// Create task li element
		const taskLiHtml = taskTmpl.replace(/{{task}}/gi, newTask.value);
		console.log(taskTmpl);
		console.log(taskLiHtml);

		todoList.innerHTML += taskLiHtml;
		addTaskInStorage(newTask.value); //save new task in local storage
		this.reset();
		newTask.focus();
	}

	form.addEventListener('submit', addItem);



	const checkBoxes = document.querySelectorAll('.ba-todo-list [type="checkbox"]');

	checkBoxes.forEach(check => {
		check.addEventListener('change', function (e) {
			console.log(this.checked);
		});
	});

	const todoWrap = document.querySelector('.ba-todo-list');
	todoWrap.addEventListener('click', doTask);
	todoWrap.addEventListener('keydown', doTask);
	function doTask(event) {
		console.log(`Clicked inside `, this, ` on element`, event.target);

		const eventEl = event.target;

		const action = eventEl.dataset.action; //Move || Edit ||Del

		console.log(eventEl);

		if (!action) return;

		let liTask = eventEl.closest('li');
		let taskInput = liTask.querySelector('[type=text]');
		let taskCheckBox = liTask.querySelector('[type=checkbox]');

		switch (action) {
			case 'move':
				// Move item to completed-list
				console.log(liTask);
				if (eventEl.checked) {
					completedList.append(liTask);
				} else {
					todoList.append(liTask);
				}
				updateTaskToggleInStorage(taskInput.value);
				break;

			case 'save':
				if (event.keyCode == '13') {
					taskInput.readOnly = true;
					taskInput.dataset.defValue = taskInput.value;
					updateTaskInStorage(taskInput);
				}
				if (event.code == 'Escape') {
					taskInput.value = taskInput.dataset.defValue;
					taskInput.readOnly = true;
				}
				// updateTaskInStorage(taskInput.value);
				break;

			case 'edit':
				//Store default value
				taskInput.dataset.defValue = taskInput.value;
				taskInput.readOnly = !taskInput.readOnly;
				taskInput.focus();
				taskInput.selectionStart = taskInput.value.length;

				if (taskInput.readOnly == false) {
					tempTask.name = taskInput.value;
					tempTask.done = taskCheckBox.checked;
					// console.log(tempTask);
				} else {
					updateTaskInStorage(taskInput);
				}


				break;

			case 'del':
				// let liTask3 = eventEl.closest('li');
				liTask.remove();
				removeTaskInStorage(taskInput.value);
				break;
		}

	}

	// show tasks from local storage
	function showTsksFromStorage() {
		let storageTasks = localStorage.getItem('ba-todo');
		storageTasks = JSON.parse(storageTasks) || [];

		console.log(storageTasks);

		let taskLiHtml = '';
		let completedTaskLiHtml = '';
		storageTasks.forEach(task => {
			console.log(task);
			if (task.done == false) {
				taskLiHtml += taskTmpl.replace(/{{task}}/gi, task.name);
			} else {
				completedTaskLiHtml += taskTmpl.replace(/{{task}}/gi, task.name);
			}

		});
		// console.log(taskLiHtml);
		todoList.innerHTML += taskLiHtml;
		completedList.innerHTML += completedTaskLiHtml;

		const checked = completedList.querySelectorAll('[type="checkbox"]');
		checked.forEach(checkbox => {
			checkbox.checked = true;
		});
	}

	showTsksFromStorage();

})();
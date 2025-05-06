const renderTasksProgressData = (tasks) => {
    let tasksProgress;
    const tasksPogressDOM = document.getElementById('tasks-progress');

    if(tasksPogressDOM) tasksProgress = tasksPogressDOM;
    else {
        const newTasksProgressDOM = document.createElement('div');
        newTasksProgressDOM.id = 'tasks-progress';
        document.getElementsByTagName('footer')[0].appendChild(newTasksProgressDOM);  
        tasksProgress = newTasksProgressDOM;
    }

    const doneTasks = tasks.filter(({checked}) => checked).length
    const totalTasks = tasks.length;
    tasksProgress.textContent = `${doneTasks}/${totalTasks}`;
}



const getCreateTasksInfo = (event) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(getNewTasksData(event))
    }, 3000)

})


const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'))
    return localTasks ? localTasks : [];
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));

}


const removeTasks = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({id}) => parseInt(id) !== parseInt(taskId))
    setTasksInLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    document
        .getElementById('todo-list')
        .removeChild(document.getElementById(taskId));
}


const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage();
    const tasksToRemove = tasks
        .filter(({checked}) => checked)
        .map(({id}) => id)

    const updatedTasks = tasks.filter(({checked}) => !checked);
    setTasksInLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    tasksToRemove.forEach((taskToRemove) => {
        document
            .getElementById('todo-list')
            .removeChild(document.getElementById(taskToRemove))
    })

}


const createTasksListItem = (tasks, checkbox) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');

    const removeTasksButton = document.createElement('button');
    removeTasksButton.textContent = 'X';
    removeTasksButton.ariaLabel = 'Remover tarefa';

    removeTasksButton.onclick = () => removeTasks(tasks.id)
    

    toDo.id = tasks.id;
    toDo.appendChild(checkbox);
    toDo.appendChild(removeTasksButton);

    list.appendChild(toDo);

    return toDo;
}

const onCheckboxClick = (event) => {
    const [id] = event.target.id.split(' ');
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map((tasks) => {
        return parseInt (tasks.id) === parseInt(id) 
            ?   {...tasks, checked: event.target.checked}
            : tasks;
    })

    setTasksInLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

}


const getCheckboxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wraper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;
    
    

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckboxClick);

    label.textContent = description;
    label.htmlFor = checkboxId;
    wraper.className = 'checkbox-label.container';

    wraper.appendChild(checkbox);
    wraper.appendChild(label);

    return wraper
}


const getNewTasksId = (event) => {
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
}

const getNewTasksData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTasksId();

    return {description, id};
}

const createTasks = async (event) =>{
    event.preventDefault(); 
    document.getElementById('save-task').setAttribute('disabled', true)
    const newTasksData =  await getCreateTasksInfo(event);
    

    const checkbox = getCheckboxInput(newTasksData)
    createTasksListItem(newTasksData, checkbox);

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [...tasks, {id: newTasksData.id, description: newTasksData.description, checked: false}]
   
    setTasksInLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    document.getElementById('description').value = ' ';
    document.getElementById('save-task').removeAttribute('disabled');
}



window.onload = function() {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTasks);

    const tasks = getTasksFromLocalStorage();

    tasks.forEach((tasks) => {
        const checkbox = getCheckboxInput(tasks);
        createTasksListItem(tasks, checkbox)
        
    })

    renderTasksProgressData(tasks);
}
const todos = [];
const RENDER_EVENT = 'render-todo';

function generateId(){
    return +new Date();
};

function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted
    }
  };
function addTodo(){
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;

    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, title, date, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function findTodo(id){
    for(const todoItem of todos){
        if(todoItem.id === id){
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(id){
    for(const index in todos){
        if(todos[index].id === id){
            return index;
        }
    }
    return -1;
}

function addTaskToCompleted(id){
    const todoTaget = findTodo(id);

    if(todoTaget === null){
        return;
    }

    todoTaget.isCompleted = true;
 
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskFromCompleted(id){
    const todoTarget = findTodoIndex(id);
    if(todoTarget === -1){
        return;
    }
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(id){
    const todoTarget = findTodo(id);
    if(todoTarget === null){
        return;
    }
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTodo(todoObject){
    const todoTitle = document.createElement('h2');
    todoTitle.innerText = todoObject.task;

    const todoDate = document.createElement('p');
    todoDate.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(todoTitle, todoDate);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    if(todoObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click',function(){
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click',function(){
            removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);
    }else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
        addTaskToCompleted(todoObject.id);
        });
        
        container.append(checkButton);
    }

    return container;
}

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit',function(event){
        event.preventDefault();

        addTodo();
    });
});


document.addEventListener(RENDER_EVENT, function () {
    // console.log(todos);
    const unCompletedTodo = document.getElementById('todos');
    unCompletedTodo.innerHTML = '';

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';

    for(const todoItem of todos){
        const todoElement = makeTodo(todoItem);
        if(!todoItem.isCompleted){
            unCompletedTodo.append(todoElement);
        }
        else{
            completedTODOList.append(todoElement);
        }
    }
});



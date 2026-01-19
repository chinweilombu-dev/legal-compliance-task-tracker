var form = document.getElementById("taskForm"),
    taskName = document.getElementById("taskName"),
    category = document.getElementById("category"),
    dueDate = document.getElementById("dueDate"),
    taskStatus = document.getElementById("status"),
    submitBtn = document.querySelector(".submit"),
    taskInfo = document.getElementById("tableData"),
    modal = document.getElementById("taskFormModal"),
    modalTitle = document.querySelector("#taskFormModal .modal-title"),
    newTaskBtn = document.querySelector(".new-task-btn"),
    searchInputBox = document.getElementById("taskSearchBox")

var numOfCompleted = 0,
    numOfOverdue = 0,
    numOfInProgress = 0,
    numOfTotalTasks = 0,
    completedText = document.getElementById("completed"),
    overdueText = document.getElementById("overdue"),
    inProgressText = document.getElementById("inProgress"),
    totalTasksText = document.getElementById("totalTasks") 


// retrieve any pre-existing data from local storage and display to UI
let getData = localStorage.getItem('taskData') ? JSON.parse(localStorage.getItem('taskData')) : []
let getStatusData = localStorage.getItem('statusData') ? JSON.parse(localStorage.getItem('statusData')) : []
let isEdit = false;  
let editId
showInfo()

//function to reset HTML DOM elements of modal when "Add New Task" button is pressed
newTaskBtn.addEventListener('click', ()=> {
    submitBtn.innerText = 'Submit',
    modalTitle.innerText = 'Please complete the required fields',
    isEdit = false,
    form.reset()
})

//search functionality: filter by task name
searchInputBox.addEventListener('input', (e) => {
    const value = e.target.value.trim().toLowerCase()
    console.log(value)

    document.querySelectorAll('.taskDetails').forEach(task =>{
        const isVisible = task.querySelector('td.taskName').textContent.toLowerCase().includes(value)
        task.classList.toggle("hide", !isVisible)
    })
})

//function to update UI and local storage when form submitted
form.addEventListener('submit', (e)=> {
    e.preventDefault()

    const dateToday = new Date();
    const dueDateObj = new Date(dueDate.value);
    if (dateToday > dueDateObj && taskStatus.value != "completed"){
        taskStatus.value = "overdue"
    }

    const information = {
        taskName: taskName.value,
        category: category.value,
        dueDate: dueDate.value,
        status: taskStatus.value,
    }

    if(!isEdit){
        getData.push(information)
    }
    else{
        isEdit = false
        getData[editId] = information
    }

    localStorage.setItem('taskData', JSON.stringify(getData))

    submitBtn.innerText = "Submit"
    modalTitle.innerHTML = "Fill The Form"

    showInfo()
    form.reset()
})

//function to rerender and display tasks to UI after each update
function showInfo(){
    document.querySelectorAll('.taskDetails').forEach(info => info.remove())
    getData.forEach((element, index) => {

        let statusTitle = ""
        switch (element.status) {
            case "not-started":
                statusTitle = "Not Started"
                break
            case "in-progress":
                statusTitle = "In Progress"
                break
            case "completed":
                statusTitle = "Completed"
                break
            case "overdue":
                statusTitle = "Overdue"
                break
        }

        let createElement = `<tr class="taskDetails">
            <td class="taskName">${element.taskName}</td>
            <td>${element.category}</td>
            <td>${element.dueDate}</td>
            <td class="${element.status}"><p>${statusTitle}</p></td>

            <td class="table-action-buttons">
                <button class="btn btn-primary" onclick="editInfo(${index},'${element.taskName}', '${element.category}', '${element.dueDate}', '${element.status}')" data-bs-toggle="modal" data-bs-target="#taskFormModal"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-danger" onclick="deleteInfo(${index},'${element.taskName}', '${element.category}', '${element.dueDate}', '${element.status}')"><i class="bi bi-trash-fill"></i></button>
            </td>
        </tr>`

        taskInfo.innerHTML += createElement
    })

    updateStatusFreq()

    // Retrieve from localStorage and update
    const statusData = JSON.parse(localStorage.getItem('statusData'))[0]
    completedText.innerHTML = statusData.completed
    overdueText.innerHTML = statusData.overdue
    inProgressText.innerHTML = statusData.inProgress
    totalTasksText.innerHTML = statusData.totalTasks

}
showInfo()

//function to adjust the modal form when editing a pre-existing task
function editInfo(index, tName, tCategory, tDueDate, tStatus){
    isEdit = true
    editId = index
    taskName.value = tName
    category.value = tCategory
    dueDate.value = tDueDate
    taskStatus.value = tStatus

    submitBtn.innerText = "Update"
    modalTitle.innerText = "Update The Form"
}

//function to delete a task entry
function deleteInfo(index){
    if(confirm("Are you sure want to delete?")){
        getData.splice(index, 1)
        localStorage.setItem("taskData", JSON.stringify(getData))
        showInfo()
    }
}

//function to update the frequencies of the status blocks
function updateStatusFreq(){
    numOfCompleted = 0
    numOfOverdue = 0
    numOfInProgress = 0
    numOfTotalTasks = 0

    getData.forEach((element) => {
        numOfTotalTasks++
        switch (element.status) {
            case "in-progress":
                numOfInProgress++
                break
            case "completed":
                numOfCompleted++
                break
            case "overdue":
                numOfOverdue++
                break
        }
    })

    // Update the UI
    completedText.innerHTML = numOfCompleted
    overdueText.innerHTML = numOfOverdue
    inProgressText.innerHTML = numOfInProgress
    totalTasksText.innerHTML = numOfTotalTasks

    // Optional: save to localStorage if needed
    const information = {
        totalTasks: numOfTotalTasks,
        inProgress: numOfInProgress,
        completed: numOfCompleted,
        overdue: numOfOverdue
    }
    localStorage.setItem('statusData', JSON.stringify([information]))  // save as array with one object
}
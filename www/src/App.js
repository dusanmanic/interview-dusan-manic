import React, {useState, useEffect} from 'react';
import { nanoid } from 'nanoid'
import './App.css';

function App() {

  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState("")
  const [checkbox, setCheckbox] = useState(false)
  const [contentEdit, setContentEdit] = useState(false)

  useEffect(() => {
    fetch("http://localhost:3002/all-tasks")
    .then(res => res.json()
    .then(data => {
      setTasks(data)
    }))
  }, [])

///////////////////////////////////////////////////////////////////////////////////////////////////////
  const SubmitTask = event => {
    event.preventDefault()

    let arrayOfTasks = {}
    // console.log(event.target.task.value)
    console.log(task)
   
    arrayOfTasks = 
    {  
      // "taskId": task.toLowerCase().replace(/\s/g, ''),
      "taskId": nanoid(),
      "taskName": task,
      "checked": false,
      "style": "none",
      "contentEdited": false
    }

    setTasks([...tasks, arrayOfTasks])
    // console.log(arrayOfTasks)
    console.log(tasks)

    fetch("http://localhost:3002/add-task", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({arrayOfTasks})
    })
    

    event.target.task.value = ""
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////
  const CheckboxType = event => {
    // console.log(event.target.checked)
    // console.log(event.target.name)
    // console.log(tasks)

    let arrayOfTasks = {}

    tasks.forEach((data, index) => {
      if(data.taskId === event.target.name) {
        // console.log(data.taskName)
        console.log(tasks[index])
        
        arrayOfTasks = {
          ...tasks[index],
          "checked": event.target.checked ? true : false,
          "style": tasks[index].checked ? "none" : "line-through"
        }
      }
    })
    
    tasks.forEach( data => {
      if(data.taskId === arrayOfTasks.taskId) {
        // console.log(data.checked, arrayOfTasks.checked)
        // console.log(data.style, arrayOfTasks.style)
        data.checked = arrayOfTasks.checked
        data.style = arrayOfTasks.style
      }
    })

    setTasks(tasks)
    setCheckbox(checkbox ? false : true)
    // console.log(checkbox)

    fetch("http://localhost:3002/update-task", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({arrayOfTasks})
    })
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////
  const DeleteItem = event => {
    event.preventDefault()
    let arrayOfTasks = {}

    console.log(event.target.classList[1])

    let filteredArray = tasks.filter( data => {
      if(data.taskId === event.target.classList[1]) {
        arrayOfTasks = data
        console.log(arrayOfTasks)
      }
      return !(data.taskId === event.target.classList[1])
    })
    setTasks(filteredArray)
    // console.log(tasks)

    fetch("http://localhost:3002/remove-task", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({arrayOfTasks})
    })    
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////
  const EditItem = event => {
    event.preventDefault()
    let arrayOfTasks = {}

    tasks.forEach((data, index) => {
      if(data.taskId === event.target.classList[1]) {
        // console.log(data.taskName)
        // console.log(tasks[index].contentEdited)
        arrayOfTasks = {
          ...tasks[index],
          "contentEdited": true
        }
        // console.log(arrayOfTasks.taskName)
      }
    })
    
    tasks.forEach( data => {
      if(data.taskId === arrayOfTasks.taskId) {
        data.contentEdited = arrayOfTasks.contentEdited
      }
    })
    setTask(arrayOfTasks.taskName)
    setContentEdit(arrayOfTasks.contentEdited ? true : false)
    setTasks(tasks)

    // console.log(tasks)
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////
  const CurrentTask = event => {
    event.preventDefault()
    setTask(event.target.value)
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////
  const CheckItem = event => {
    event.preventDefault()
    let arrayOfTasks = {}

    tasks.forEach((data, index) => {
      if(data.taskId === (event.target.classList[1])) {
        // console.log(data.taskName)
        // console.log(tasks[index].contentEdited)
        tasks[index] = {
          ...tasks[index],
          "taskName": task,
          "contentEdited": false
        }
        
        arrayOfTasks = tasks[index]
        setContentEdit(tasks[index].contentEdited ? true : false)

        // console.log(tasks[index])
        // console.log(arrayOfTasks)
      }
    })

    fetch("http://localhost:3002/update-task", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({arrayOfTasks})
    })

    // console.log(event.target.classList[1])
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div className="App">

      <form className="form-task" onSubmit={SubmitTask}>
        <label className="form-task-label"> Enter task </label>
        <input className="form-task-input" type="text" name="task" onChange={CurrentTask} />
        <button className="form-task-submit" type="submit"> Submit task </button>
      </form>     
 
      <div className="task-container" >
          {
            tasks.map(data => {              
              if(!data.contentEdited) {
                return (              
                  <div className="task-wrapper" key={nanoid()} >
                    <input className="task-checkbox" type="checkbox" name={data.taskId} onChange={CheckboxType} checked={data.checked} />
                    <p className="task-text" style={{ textDecoration: data.style }}> {data.taskName} </p>
                    <div className="pencil-bin-mark">
                      <div className={`pencil ${data.taskId}`} onClick={EditItem} />
                      <div className={`bin ${data.taskId}`} onClick={DeleteItem} />
                    </div>
                  </div>
                )
              } else {
                return (              
                  <div className="task-wrapper" key={nanoid()} >
                    <p className="task-text" style={{marginLeft: '15px'}}>Edit task:</p>
                    <input className="task-input" type="text" name="editedTask" onChange={CurrentTask} value={task} />
                    <div className="pencil-bin-mark">
                      <div className={`mark ${data.taskId}`} onClick={CheckItem} />
                      <div className={`bin ${data.taskId}`} onClick={DeleteItem} />
                    </div>
                  </div>
                )
              }             
            })
          }
      </div>

    </div>
  );
}

export default App;

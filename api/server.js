const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

const {Tasks} = require('./models/tasks.model')

const app = express();

// middleware
app.use(express.json());
app.use(cors());

const port = 3002;

app.listen(port, () => console.log(`Server is running on port: ${port}`))

const url = "mongodb+srv://administrator:NemaSifra123@cluster0.zhtov.mongodb.net/tasksDB"

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})

const connection = mongoose.connection
connection.once( 'open', () => {
    console.log('MongoBD connection established')
})

app.post('/add-task', (req, res) => {

        const addTask = new Tasks({
            taskId: `${req.body.arrayOfTasks.taskId}`,
            taskName: `${req.body.arrayOfTasks.taskName}`,
            checked: req.body.arrayOfTasks.checked,
            style: `${req.body.arrayOfTasks.style}`,
            contentEdited: false
        })

        addTask.save()
})

app.post('/update-task', (req, res) => {

    Tasks.updateOne(
        {"taskId": `${req.body.arrayOfTasks.taskId}`},
        {$set: {"style": `${req.body.arrayOfTasks.style}`, "taskName": `${req.body.arrayOfTasks.taskName}`, "checked": req.body.arrayOfTasks.checked}}
    )
    .then( data => console.log(data))
    .catch( error => console.log(error))

})

app.post('/remove-task', (req, res) => {

    Tasks.remove({"taskId": `${req.body.arrayOfTasks.taskId}`})
    .then( data => console.log(data))
    .catch( error => console.log(error))

})

app.get('/all-tasks', (req, res) => {

    Tasks.find()
    .then( data => res.send(data))
    .catch( error => res.send(error))
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// app.post('/getTask', (req, res) => {
//     req.body.arrayOfItems.forEach( (data, index) => {
//         console.log(data.taskName)
//     })
//     // console.log(req.body.arrayOfItems)
// })
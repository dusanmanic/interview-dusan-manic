// const mongoose = require('mongoose')

// const task = {
//     taskId: String,
//     taskName: String,
//     checked: Boolean,
//     style: String,
//     contentEdited: Boolean

// }

// const Tasks = mongoose.model("tasks", task)

// module.exports = Tasks


const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    taskId: String,
    taskName: String,
    checked: Boolean,
    style: String,
    contentEdited: Boolean
})

module.exports.Tasks = mongoose.model("tasks", taskSchema)
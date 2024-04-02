const express = require('express');
const mongoose = require('mongoose');
const Schema = require('./schemas');
const app = express();
const PORT = 5000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/todoDemoDB';
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });




app.use(express.json());
app.post('/addtodo', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const newtodo = new Schema.TodoSchema({
      taskname: data.task,
      deadline: data.deadline,
    });
    const result = await newtodo.save();
    if (result.length !== 0) {
      res.status(200).json({ status: 200, message: 'Added Sucessfully' });
    }
    else {
      res.status(422).json({ status: 422, message: 'try again' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/gettodo', async (req, res) => {
  try {
    const result = await Schema.TodoSchema.find();
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/deletetodo', async (req, res) => {
  try {
    // const todo = await Todo.findByIdAndRemove(req.params.id);
    const todo = await Schema.TodoSchema.findOneAndRemove(req.body.id)
    if (!todo) {
      res.status(404).json({ error: 'To-Do not found' });
    } else {
      res.json({status:200, message: 'To-Do deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/updatetodo', async (req, res) => {
  try {
    // const todo = await Todo.findByIdAndRemove(req.params.id);
    console.log(req.body)
    const todo = await Schema.TodoSchema.findOneAndUpdate(
      { _id: req.body.id },      
      { completed: true }, 
      { new: true }             
    );
    if(todo!=null){
          res.send({status:200,message:"Updated sucessfully"});
    }
    else{
      res.send({status:422,message:"Try again"});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
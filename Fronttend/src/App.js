import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
function App() {
  const [tasks, setTasks] = useState([]);
  const notifyerror=(message)=>{
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
  }
  const notifysuccess=(message)=>{
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
  }
  const [task, setTask] = useState('');
  const [deadline, setDeadline] = useState('');
  const handleCheckboxChange = async (e) => {
    const name = parseInt(e.target.name);
    const id = tasks[name]._id;
    const completed = tasks[name].completed;
    const updatedTasks = [...tasks];
    const result = await fetch("/updatetodo", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        id, completed
      })
    });
    const res = await result.json();
    if (res.status === 200) {
      notifysuccess(res.message);
     // window.alert("Done Sucessfully");
      updatedTasks[name] = {
        ...updatedTasks[name],
        completed: !updatedTasks[name].completed,
      };
      setTasks(updatedTasks);
    }
    else {
      notifyerror("Something went wrong");
      //window.alert("Try again Something went wrong");
    }

  };
  function formatDeadline(task) {
    const inputDate = task.deadline;
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/gettodo');
        const result = await response.json();
        const formattedTasks = result.map(task => ({
          ...task,
          deadline: formatDeadline(task),
        }));
        setTasks(formattedTasks);
      } catch (error) {
        notifyerror(error);
        console.error('Error fetching data:', error);
      }

    }
    fetchData();
  }, [task, deadline]);
  const addTask = async () => {
    if (task && deadline) {
      console.log(task);
      console.log(deadline);
      const result = await fetch("/addtodo", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          task, deadline
        })
      });
      const res = await result.json();
      console.log(res.status);
      if (res.status === 200) {
        notifysuccess(res.message);
        //window.alert("Added Sucessfully");
        setTasks([...tasks, { task, deadline }]);
        setTask('');
        setDeadline('');
      }
      else {
        notifyerror("Something went wrong");
       // window.alert("Try again Something went wrong");
      }
    }
  };
  const removeTask = async (index) => {
    const updatedTasks = [...tasks];
    const id = tasks[index]._id;
    console.log(id);
    const result = await fetch("/deletetodo", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        id
      })
    });
    const res = await result.json();
    console.log(res.status);
    if (res.status === 200) {
      notifysuccess(res.message);
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
    }
    else {
      notifyerror("Something went wrong");
      //window.alert("Try again Something went wrong");
    }
  };
  return (
    <center style={{marginTop:"8rem"}}>  
    <div className="App">
      <h1>21IT101 Daily Routine</h1>
      <div className="task-form">
        <input
          type="text"
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            <p className={t.completed === true ? 'enabled-input' : 'disabled'} >{t.taskname} - Deadline: {t.deadline}</p>
            <input disabled={t.completed} name={`${index}`} type="checkbox" checked={t.completed} onChange={handleCheckboxChange} />
            <button onClick={() => removeTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
    <ToastContainer/>
    </center>
  );
}
export default App;
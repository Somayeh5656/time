import React, { useState } from "react";
import "./routines.css"
import { RiAddLargeFill } from "react-icons/ri";


const weeknames=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


const Today= new Date(); 
const weekday= Today.toLocaleDateString('en-US', {weekday:"long"});
const day= Today.getDate();
const month=Today.toLocaleDateString('en-US', {month:"long"})
const year=Today.getFullYear();
const formattedData= `${weekday} - ${day}. ${month} ${year}`

const todayDay= Today.getDay();
const startOfWeek= new Date;
startOfWeek.setDate(Today.getDate()- (todayDay+6)%7);

const getWeekDates=()=>{
    const dates=[];
    for(let i=0;i<7;i++){
        const date= new Date(startOfWeek)
        date.setDate(startOfWeek.getDate()+i)
        dates.push(date);
    }
    return dates;
}


const getCurrentTime=()=>{
    const now= new Date();
    const hour= now.getHours().toString().padStart(2,'0');
    return `${hour}:00`
}

const getOneHourLater=(timeStr)=>{
    const [hour]= timeStr.split(":").map(Number);
    const nextHour= ((hour+1)%24).toString().padStart(2, '0');
    return `${nextHour}:00`
}

const hoursOptions= Array.from({length:24}, (_,i)=> 
    `${i.toString().padStart(2,'0')}:00`);




const Routines = ()=>{
   
    const [tasks, setTasks]= useState([]);
    const [showForm, setShowForm]= useState(false);
    const [newTask, setNewTask] =useState({title:"", start:"" , end: ""})
    const [editingIndex, setEditingIndex]=useState(null);

    const weekDates= getWeekDates();

    const handleAddTask=()=>{
        const startTime=getCurrentTime();
        const endTime=getOneHourLater(startTime);
        setShowForm(true);
        setEditingIndex(null);
        setNewTask({title:"", start:startTime, end:endTime})
    };

    const handleTaskSubmit= ()=>{        
        const task={
            title: newTask.title,
            start: parseInt(newTask.start),
            end: parseInt(newTask.end)
        };

        if( editingIndex !==null ){
            const updatedTask=[...tasks];
            updatedTask[editingIndex]=task;
            setTasks(updatedTask);

        }
        
        else{
            setTasks([...tasks, task])
        }

        setTasks([...tasks, task]);
        setNewTask({title:"",start:"",end:""})
        setEditingIndex(null);
        setShowForm(false);

    };

    const handleCancel=()=>{
        setShowForm(false);
    };

    const handleEditing=(task, index)=>{
        setNewTask({
            title:task.title,
            start :task.start.toString().padStart(2,'0'),
            end: task.end.toString().padStart(2,'0')
        });
        setEditingIndex(index);
        setShowForm(true);

    }

       
    return (
        <div className="routines-container">
            <h3 className="dayview-header">
                <span className="day.title">{formattedData}</span>
                
                <button className="add-task-btn" onClick={handleAddTask}>
                    <RiAddLargeFill />
                </button>
            </h3>



            <div className="weekdays-row">
                {weekDates.map((date, index)=>{
                    const isToday=date.toDateString()==Today.toDateString();
                    const weekDayName= weeknames[index];
                    const weekDateName= date.getDate();

                    return(
                        <div key={index} className="weekday-cell">
                            <div className="weekday-name"> {weekDayName} </div>
                            <div className={`weekday-date ${isToday ? "today-circle" : ""}`} >
                                {weekDateName}
                            </div>
                        </div>
                    );
                })}
            </div>


            <div>
                {hoursOptions.map((hour, i)=>(
                    <div key={i} className="dayview-hour">
                        {hour}
                        {
                         tasks.filter(task=> task.start <= i && task.end >= i)
                         .map((task,idx)=>(
                            <span key={idx} className="hour-task" oncClick={()=>handleEditingTask(task,idx)}>
                                {task.title}
                            </span>
                         ))   
                        }
                    </div>
                ))}
            </div>


            {
                showForm && (
                    <div className="task-form-slide">
                        <div className="task-form">

                            <div className="task-header">
                                <span onClick={handleCancel} >
                                Cancel
                                </span>
                                <span>New Task</span>
                                <span 
                                    onClick={handleTaskSubmit} disabled={ !newTask.title.trim()} 
                                    style={{opacity : newTask.title.trim() ? 1: 0.5 , 
                                    cursor : newTask.title.trim() ? 'pointer':'not-allowed'}} 
                                    >Add 
                                </span>
                            </div>

                            <div className="task-body">
                                <label>Task's title: </label>
                                <input className= "title-input" 
                                placeholder="Title" 
                                value={newTask.title} 
                                onChange={(e)=> setNewTask({...newTask, title:e.target.value})}
                                >
                                </input>

                                <div className="time-inputs">
                                    <label>Start time: </label>
                                    <input value={newTask.start} 
                                    list="hour-options"
                                    onChange={(e)=> setNewTask({...newTask,start: e.target.value})}
                                    />            
                                    <datalist id="hour-options" >
                                        {hoursOptions.map((h,i)=>(
                                            <option key={i} value={h} />
                                        ))}
                                    </datalist>

                                    <label>End Time: </label>
                                    <input
                                    list="hour-options"
                                    value={newTask.end } 
                                    onChange={(e)=>setNewTask({...newTask, end: e.target.value})}
                                    />
                                    <datalist id="hour-options">
                                        {hoursOptions.map((h,i)=>(
                                            <option key={i} value={h}></option>
                                        ))};
                                    </datalist>
                                </div>
                            
                                <div>
                                    <span 
                                        className="delete-button"
                                        onClick={handleDelete}                              
                                    >
                                    Delete task
                                    </span>
                                                    
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }



        </div>

      );
    };
export default Routines;
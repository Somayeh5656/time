import React, { useState } from "react";
import "./taskForm.css";

const TaskForm = ({
  newTask,
  showForm,
  setNewTask,
  handleTaskSubmit,
  handleCancel,
  editingIndex,
  handleDeleteTask,
}) => {

    const [errors, setErrors]= useState({start:"",end:""});

    const validateTimeInput=(timeStr)=>{
        const timeRegex=/^([01]\d|2[0-3]):(00|15|30|45)$/;
        return timeRegex.test(timeStr);

    }    
    const isEndAfterStart=(start,end)=>{
        const [sh,sm]=start.split(":").map(Number);
        const [eh,em]=end.split(":").map(Number);

        return eh>sh || (eh===sh && em>sm);
    };

  const hoursOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4).toString().padStart(2, "0");
    const minutes = (i % 4 * 15).toString().padStart(2, "0");
    return `${hour}:${minutes}`;
  });

  return (
    showForm && (
      <div className="task-form-slide">
        <div className="task-form">
          <div className="task-header">
            <span onClick={handleCancel}>Cancel</span>
            <span>{editingIndex !== null ? "Edit Task" : "New Task"}</span>
            <span
              onClick={handleTaskSubmit}
              disabled={
                !newTask.title.trim()||
                errors.start||
                errors.end||
                !validateTimeInput(newTask.start)||
                !validateTimeInput(newTask.end)||
                !isEndAfterStart(newTask.start,newTask.end)
              }
            style={{
                opacity:
                newTask.title.trim()&&
                !errors.start &&
                !errors.end&&
                validateTimeInput(newTask.start)&&
                validateTimeInput(newTask.end)&&
                isEndAfterStart(newTask.start, newTask.end)
                ? 1: 0.5,

                cursor:
                newTask.title.trim()&&
                !errors.start &&
                !errors.end&&
                validateTimeInput(newTask.start)&&
                validateTimeInput(newTask.end)&&
                isEndAfterStart(newTask.start, newTask.end)
                ? "pointer": "not-allowed"

            }}

              
            >
              {editingIndex !== null ? "Save" : "Add"}
            </span>
          </div>

          <div className="task-body">
            <label>Task's title:</label>
            <input
              className="title-input"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />

            <div className="time-inputs">
              <label>Start time:</label>
              <input
                value={newTask.start}
                list="hour-options"
                onChange={(e)=>{
                    const value=e.target.value;
                    setNewTask({...newTask, start:value});
                    const valid= validateTimeInput(value);
                    const after= newTask.end && isEndAfterStart(value,newTask.end);

                    setErrors((prev)=>({
                        ...prev,
                        start:!valid 
                        ? "Time must be in hh:mm firmat and end in 00, 15, 30 or 45"
                        : "",
                        end:
                        newTask.end && valid && !after
                        ?"End time must be after start time"
                        :"",
                    }))
                }}
              />

              {errors.start&& (
                <div className="error-message"> {errors.start}</div>
              )}


              <label>End time:</label>
              <input
                value={newTask.end}
                list="hour-options"

                onChange={(e)=>{
                    const value=e.target.value;

                    const valid= validateTimeInput(value);
                    const after= newTask.start && isEndAfterStart(newTask.start, value);
                    setNewTask({...newTask, end:value});
                    
                    setErrors((prev)=>({
                        ...prev,
                        end:
                        !valid
                        ?"Time must be in hh:mm format and en in 00, 15, 30 or 45"
                        :newTask.end && valid && !after
                        ?"End time must be after start time"
                        : "",

                    }))
                }}
              />
              {errors.end&&
              (
                <div className="error-message">{errors.end}</div>
              )
              }
               

              <datalist id="hour-options">
                {hoursOptions.map((h, i) => (
                  <option key={i} value={h} />
                ))}
              </datalist>
            </div>

            {editingIndex !== null && (
              <div className="task-footer">
                <span className="delete-task" onClick={handleDeleteTask}>
                  Delete Task
                </span>
              </div>
            )}

            <div className="repeat">
              <label>Repeat:</label>
              <select
                value={newTask.repeat}
                onChange={(e) =>
                  setNewTask({ ...newTask, repeat: e.target.value })
                }
              >
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default TaskForm;

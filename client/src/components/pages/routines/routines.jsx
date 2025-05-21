import React, { useEffect, useState } from "react";
import "./routines.css";
import { RiAddLargeFill } from "react-icons/ri";
import DayView from "./dayView";
import WeekHeader from "./weekHeader";
import TaskForm from "./taskForm";
import { LuTimerReset } from "react-icons/lu";

const weeknames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const Today = new Date();



// Apufunktio viikon päivämäärien hakemiseen
const getWeekDates = (startDate) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Apufunktio viikon alkamispäivän hakemiseen
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay() === 0 ? 7 : d.getDay(); // Jos sunnuntai (0), muutetaan se 7:ksi
    d.setDate(d.getDate() - day + 1); // Mennään takaisin maanantaihin

    return d;
  };

// Apufunktio nykyisen ajan hakemiseen
const getCurrentTime = () => {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, "0");
  return `${hour}:00`;
};

// Apufunktio yhden tunnin lisäämiseen
const getOneHourLater = (timeStr) => {
  const [hour] = timeStr.split(":").map(Number);
  const nextHour = ((hour + 1) % 24).toString().padStart(2, "0");
  return `${nextHour}:00`;
};

const timeStringToMinutes=(timeStr)=>{
    const [hours, minutes]= timeStr.split(":").map(Number);
    return hours *60 +minutes;
    
}

const minutesToTimeString=(minutes)=>{
    const hr= Math.floor(minutes/60).toString().padStart(2,"0");

    const mins=(minutes%60).toString().padStart(2,"0");
    return `${hr}:${mins}`;
}

const hoursOptions = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, "0")}:00`
);

const Routines = () => {
  // Näytettävä päivämäärä merkkijonona, esim. "Monday - 10. May 2025"
  const [formattedDateStr, setFormattedDateStr] = useState("");
  // Viikon alkamispäivä (maanantai), Date-objekti, käytetään viikkonäkymässä
  const [weekStartDateFunObjD, setWeekStartDateFunObjD] = useState(getStartOfWeek(Today));
  // Valittu päivämäärä, Date-objekti
  const [selectedDateObjD, setSelectedDateObjD] = useState(Today);
  // Lomakkeen näkyvyystila, boolean-arvo
  const [showFormBol, setShowFormBol] = useState(false);
  // Lomakkeen sisällön tiedot
  const [newTaskObj, setNewTaskObj] = useState({ title: "", start: "", end: "", repeat: "" });
  // Päivämääräkohtaiset tehtävät
  const [tasksByDateObj, setTasksByDateObj] = useState({});
  // Muokattavan tehtävän indeksi listassa
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors,setErrors]=useState({start:"",end:""});


  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks?userId=123");
      const data = await res.json();

      const tasksGroupedByDate = {};
      data.forEach((task) => {
        if (!tasksGroupedByDate[task.date]) {
          tasksGroupedByDate[task.date] = [];
        }
        tasksGroupedByDate[task.date].push(task);
      });

      setTasksByDateObj(tasksGroupedByDate);
    } catch (err) {
      console.error("Virhe tehtävien haussa:", err);
    }
  };

  fetchTasks();
}, []);

  // Päivitetään päivämäärän näyttö
  const updateFormattedDate = () => {
    const weekDayName = selectedDateObjD.toLocaleDateString("en-US", { weekday: "long" });
    const day = selectedDateObjD.getDate();
    const month = selectedDateObjD.toLocaleDateString("en-US", { month: "long" });
    const year = selectedDateObjD.getFullYear();
    setFormattedDateStr(`${weekDayName} - ${day}. ${month} ${year}`);
  };


  useEffect(() => {
    updateFormattedDate();
  }, [selectedDateObjD]);


 
const selectedDateKey=selectedDateObjD.toISOString().split("T")[0];
const getTasksForSelectedDate=()=> {
    const baseTasks=tasksByDateObj[selectedDateKey]|| [];
    const allTasks=[];

    for(const dateKey in tasksByDateObj){
        for (const task of tasksByDateObj[dateKey])
        {
            if (task.repeat==="daily" ||
            (task.repeat==="weekly" && new Date(dateKey).getDay()===selectedDateObjD.getDay())
            || (task.repeat==="monthly"&& new Date(dateKey).getDate()===selectedDateObjD.getDate())){
                allTasks.push(task);

            }

        }
    }

    const combinedTasks= [...baseTasks,...allTasks].filter(
        (task,index,self)=>
        index===self.findIndex(
        (t)=> 
        t.title===task.title &&
        t.start===task.start && 
        t.end===task.end &&
        t.repeat===task.repeat));

    return combinedTasks;};

  
  const tasks = getTasksForSelectedDate();


  // Funktio, joka päivittää tehtävät tietylle päivälle
  const setTasksForDate = (dateKey, tasks) => {
    setTasksByDateObj((prev) => ({ ...prev, [dateKey]: tasks }));
  };

  // Funktio tehtävän lisäämiseen
  const handleAddTask = () => {
    const startTime = getCurrentTime();
    const endTime = getOneHourLater(startTime);
    setShowFormBol(true);
    setEditingIndex(null);
    setNewTaskObj({ title: "", start: startTime, end: endTime, repeat: "" });
  };

  // Siirrytään seuraavaan viikkoon
  const handleNextWeek = () => {
    const newStart = new Date(weekStartDateFunObjD);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStartDateFunObjD(newStart);
    setSelectedDateObjD(newStart);
  };

  // Siirrytään edelliseen viikkoon
  const handlePrevWeek = () => {
    const newStart = new Date(weekStartDateFunObjD);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStartDateFunObjD(newStart);
    setSelectedDateObjD(newStart);
  };

  // Peruutetaan lomake
  const handleCancel = () => {
    setShowFormBol(false);
  };

  // Tehtävän muokkaaminen
  const handleEditing = (task, index) => {
    setNewTaskObj({
      title: task.title,
      start: minutesToTimeString(task.start),
      end: minutesToTimeString(task.end),
      repeat: task.repeat,
    });
    setEditingIndex(index);
    setShowFormBol(true);
  };


  // Tehtävän poistaminen
  const handleDeleteTask = () => {
   
      if (editingIndex !==null){
        const taskToDelete= tasks[editingIndex];

        for( const dateKey in tasksByDateObj){
            const taskList=tasksByDateObj[dateKey];

            const indexInOriginal=taskList.findIndex(t=>
                t.title==taskToDelete.title && 
                t.start=== taskToDelete.start &&
                t.end===taskToDelete.end &&
                t.repeat === taskToDelete.repeat
            );

            if(indexInOriginal!==-1){
                const newTaskList=[...taskList];
                newTaskList.splice(indexInOriginal,1);
                setTasksForDate(dateKey,newTaskList);
                break;
            }
        }

      }
  
      // Nollataan lomake ja tilat
      setEditingIndex(null);
      setShowFormBol(false);
      setNewTaskObj({ title: "", start: "", end: "", repeat: "" });
    
  };
  


  // Tehtävän tallentaminen lomakkeen kautta
const handleTaskSubmit = async () => {
  const task = {
    title: newTaskObj.title,
    start: timeStringToMinutes(newTaskObj.start),
    end: timeStringToMinutes(newTaskObj.end),
    repeat: newTaskObj.repeat,
    date: selectedDateKey, // esim. "2025-05-21"
    userId: "123", // tämä tulisi yleensä kirjautumisen kautta (esim. localStorage, JWT, context)
  };

  const updatedTasks = [...tasks];
  if (editingIndex !== null) {
    updatedTasks[editingIndex] = task;
  } else {
    updatedTasks.push(task);
  }

  setTasksForDate(selectedDateKey, updatedTasks);
  setShowFormBol(false);
  setEditingIndex(null);
  setNewTaskObj({ title: "", start: "", end: "", repeat: "" });

  // 🛜 Lähetä palvelimelle
  try {
    const response = await fetch("/api/tasks", {
      method: editingIndex !== null ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Tehtävän tallennus epäonnistui");
    }
  } catch (error) {
    console.error("Virhe tallennettaessa:", error);
  }
};




  const handleResetToToday = () => {
    const today = new Date();
    setSelectedDateObjD(today);
    setWeekStartDateFunObjD(getStartOfWeek(today));
  };


  return (
    <div className="routines-container">
        <h3 className="dayview-header">
        <span className="day-title">{formattedDateStr}</span>
        <span className="button-group">
            <button
            className="reset-today-btn"
            onClick={handleResetToToday}
            disabled={selectedDateObjD.toDateString() === Today.toDateString()}
            >
            <LuTimerReset />
            </button>
            <button className="add-task-btn" onClick={handleAddTask}>
            <RiAddLargeFill />
            </button>
        </span>
        </h3>


      <div className="week-navigation">
        <button onClick={handlePrevWeek}>← Previous</button>      
        <button onClick={handleNextWeek}>Next →</button>
        
      </div>

      <WeekHeader
        weekDates={getWeekDates(weekStartDateFunObjD)}
        weeknames={weeknames}
        Today={Today}
        selectedDate={selectedDateObjD}
        setSelectedDate={setSelectedDateObjD}
        
      />


      <DayView
        hoursOptions={hoursOptions}
        tasks={tasks}
        handleEditing={handleEditing}
        timeStringToMinutes={timeStringToMinutes}

      />

      <TaskForm
        showForm={showFormBol}
        newTask={newTaskObj}
        setNewTask={setNewTaskObj}
        handleTaskSubmit={handleTaskSubmit}
        handleCancel={handleCancel}
        editingIndex={editingIndex}
        handleDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default Routines;

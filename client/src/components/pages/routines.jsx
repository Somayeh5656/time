import React from "react";
import "./routines.css"
import { RiAddLargeFill } from "react-icons/ri";

const Today= new Date(); 

const weekday= Today.toLocaleDateString('en-US', {weekday:"long"});
const day= Today.getDate();
const month=Today.toLocaleDateString('en-US', {month:"long"})
const year=Today.getFullYear();

const formattedData= `${weekday} - ${day}. ${month} ${year}`

const hours= Array.from({length:24}, (_,i)=> `${i}:00`);


const weeknames=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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



const Routines = ()=>{
    const weekDates= getWeekDates();
    
    return (
        <div className="routines-container">
            <h3 className="dayview-header">
                <span>{formattedData}</span>
                <button className="add-task-btn" >
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
                            <div className="weekday-name">{weekDayName} </div>
                            <div className={`weekday-date ${isToday ? "today-circle":""}`} >
                                {weekDateName}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                {hours.map((hour)=>(
                    <div key={hour} className="dayview-hour">
                        {hour}
                    </div>
                ))}
            </div>

        </div>

      );
    };
export default Routines;
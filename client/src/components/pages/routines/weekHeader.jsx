import React from "react";
import "./weekHeader.css"

const WeekHeader=({weeknames, weekDates, Today, selectedDate, setSelectedDate})=>{

    return(

        <div className="weekdays-row">
        {weekDates.map((date, index)=>{
            const isToday=date.toDateString()== Today.toDateString();
            const isSelected= date.toDateString()===selectedDate.toDateString();
            const weekDayName= weeknames[index];
            const weekDateName= date.getDate();

            return(
                <div key={index} className="weekday-cell"
                onClick={()=>setSelectedDate(date)} >
                    <div className="weekday-name"> {weekDayName} </div>
                    <div className={`weekday-date ${isToday ? "today-circle" : ""} ${isSelected ? "selected": ""}`} >
                        {weekDateName}
                    </div>
                </div>
            );
        })}
    </div>
        

    );

}
export default WeekHeader;

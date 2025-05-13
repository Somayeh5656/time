import React, { useEffect, useState } from "react";
import "./dayView.css";

const CELL_HEIGHT = 66.8; // px per tunti
const MINUTES_IN_HOUR = 60;
const PX_PER_MINUTE = CELL_HEIGHT / MINUTES_IN_HOUR;

const DayView = ({ hoursOptions, tasks, handleEditing }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Päivitä kerran minuutissa
    return () => clearInterval(interval);
  }, []);

  const getOverlappingGroups = () => {
    const groups = [];
    const sorted = [...tasks].sort((a, b) => (a.start) - (b.start));
    for (let i = 0; i < sorted.length; i++) {
      let group = [sorted[i]];
      for (let j = i + 1; j < sorted.length; j++) {
        if ((sorted[j].start) < (group[group.length - 1].end)) {
          group.push(sorted[j]);
        } else {
          break;
        }
      }
      groups.push(group);
      i += group.length - 1;
    }
    return groups;
  };

  

  const renderTasks = () => {
    const groups = getOverlappingGroups();
    let rendered = [];

    groups.forEach((group, groupIndex) => {
      const width = 100 / group.length;

      group.forEach((task, i) => {
        const top = (task.start) * PX_PER_MINUTE;
        const height = ((task.end) - (task.start)) * PX_PER_MINUTE;


        rendered.push(
          <div
            key={`${groupIndex}-${i}`}
            className="event-block"
            style={{
              top,
              height,
              left: `${i * width}%`,
              width: `${width}%`,
             
            }}
            onDoubleClick={() => handleEditing(task, tasks.indexOf(task))}
          >
            {task.title}
          </div>
        );
      });
    });

    return rendered;
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const indicatorTop = currentMinutes * PX_PER_MINUTE;

  return (
    <div className="dayview-container">
      <div className="indicator" style={{ top: `${indicatorTop}px` }}>
        <div className="indicator-circle">
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="indicator-line"></div>
      </div>

      {hoursOptions.map((hour, i) => (
        <div key={i} className="dayview-hour">
          <div className="hour-label">{hour}</div>
        </div>
      ))}

      {renderTasks()}
    </div>
  );
};

export default DayView;

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CustomCalendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    const apiFetchedDates = [
      new Date(2025, 2, 11).toDateString(),
      new Date(2025, 2, 17).toDateString(),
      new Date(2025, 2, 22).toDateString(),
    ];
    setSelectedDates(apiFetchedDates);
  }, []);

  return (
    <div className="flex justify-center p-1">
      <Calendar
        tileClassName={({ date }) =>
          selectedDates.includes(date.toDateString()) ? "quiz-date" : "non-clickable"
        }
        onClickDay={(date, event) => event.preventDefault()}
      />
      <style>
        {`
          .quiz-date {
            background-color: #6C0404 !important;
            color: white !important;
            border-radius: 50%;
            cursor: auto !important;
          }
          .react-calendar__tile--active {
            background: none !important; 
            color: inherit !important;
            cursor: auto !important;
          }
          .react-calendar__tile:enabled:hover {
            background: none !important;
            color: inherit !important;
            cursor: auto !important;
            }
          .react-calendar__tile--now {
            background: none !important;
            color: inherit !important;
            cursor: auto !important;
          }
        `}
      </style>
    </div>
  );
};

export default CustomCalendar;

import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const MIN_LENGTH = 1;
const MAX_LENGTH = 60;

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const beepSound = useRef(null);

  const reset = () => {
    beepSound.current.pause();
    beepSound.current.currentTime = 0;
    setIsRunning(false);
    setTimerLabel("Session");
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
  };

  const handleLengthChange = (newLength, setLength) => {
    if (!isRunning && newLength >= MIN_LENGTH && newLength <= MAX_LENGTH) {
      setLength(newLength);
      setTimeLeft(newLength * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      beepSound.current.play();

      if (timerLabel === "Session") {
        setTimerLabel("Break");
        setTimeLeft(breakLength * 60);
      } else if (timerLabel === "Break") {
        setTimerLabel("Session");
        setTimeLeft(sessionLength * 60);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, timeLeft, breakLength, sessionLength, timerLabel]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  return (
    <div className="window glass-effect">
      <div className="title">Pomodoro Timer</div>
      <div id="break-label" className="label">
        Break Length
      </div>
      <div className="buttons">
        <button
          id="break-decrement"
          className="button"
          onClick={() => handleLengthChange(breakLength - 1, setBreakLength)}
        >
          Decrease
        </button>
        <div id="break-length" className="value">
          {breakLength}
        </div>
        <button
          id="break-increment"
          className="button"
          onClick={() => handleLengthChange(breakLength + 1, setBreakLength)}
        >
          Increase
        </button>
      </div>

      <div id="session-label" className="label">
        Session Length
      </div>
      <div className="buttons">
        <button
          id="session-decrement"
          className="button"
          onClick={() =>
            handleLengthChange(sessionLength - 1, setSessionLength)
          }
        >
          Decrease
        </button>
        <div id="session-length" className="value">
          {sessionLength}
        </div>
        <button
          id="session-increment"
          className="button"
          onClick={() =>
            handleLengthChange(sessionLength + 1, setSessionLength)
          }
        >
          Increase
        </button>
      </div>

      <div id="timer-label" className="label">
        {timerLabel}
      </div>
      <div id="time-left" className="clock">
        {formatTime(timeLeft)}
      </div>

      <div className="buttons no-border">
        <button id="start_stop" className="button" onClick={toggleTimer}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" className="button" onClick={reset}>
          Reset
        </button>
      </div>

      <audio
        id="beep"
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        ref={beepSound}
      ></audio>
    </div>
  );
};

export default App;

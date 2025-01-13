import React from "react";
import Countup from "react-countup";
import { RotateCcw, Gamepad2  } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';

const GameInfo = ({ bestScore, score, onReset , onClickhowtoplay}) => {
  // console.log("test --", bestScore, score);
  return (
    <div className="absolute bottom-12 w-full    flex-center-items">
      <div className="relative px-3 py-3 shadow-xl backdrop-blur-md bg-[#94a3b840] rounded-lg     flex flex-row items-center justify-around gap-4">
        <div className="">Best Moves: {bestScore}</div>
        <div>Moves: {score}</div>
        <div>
          <Tooltip title="Reset" placement="top" className="cursor-pointer" onClick={onReset} >
            <RotateCcw />
          </Tooltip>
        </div>
        <div>
          <Tooltip title="How to Play" placement="top" className="cursor-pointer" onClick={onClickhowtoplay} >
            <Gamepad2  />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;

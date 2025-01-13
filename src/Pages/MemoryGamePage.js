import React, { useEffect, useState,forwardRef } from "react";
import Countup from "react-countup";
import {  Gamepad2 , Lightbulb, Goal, CirclePlay   } from 'lucide-react';
import confetti from "canvas-confetti";
import GameInfo from "../components/GameInfo";
import { shuffleArray } from "../utilities/suffleArray";


import { Dialog, DialogTitle, DialogContent, Slide} from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
 
const MemoryGamePage = () => {
  console.log("test");
  const [gameSize, setGameSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [movesMade, setMovesMade] = useState(0);

  const [bestScore, setBestScore] = useState(0);
  const [howToPlayModal, setHowToPlayModal] = useState(false);
  const [successPopUp, setSuccessPopUp] = useState(false);
 

  const handleResetCards = ()=>{
    let tempItems = Array.from({ length: (gameSize * gameSize) / 2 }, (_, i) => ({ val: i + 1, isMatched: false, isFlipped: false }) );

    let final_temp_arr = [...structuredClone(tempItems), ...structuredClone(tempItems)];
    let temp_cards = shuffleArray(final_temp_arr);
    // console.log(temp_cards);
    setCards(temp_cards);
    setMovesMade(0);

    let temp_best_score = localStorage.getItem("best_score");
    if(temp_best_score) setBestScore(temp_best_score);

    // setSuccessPopUp(false);
  }
  const handleConfetti = () => {
    setSuccessPopUp(true);

    const duration = 3000; // 3 seconds
    const end = Date.now() + duration;

    // Confetti from the left and right
    const frame = () => {
      const timeLeft = end - Date.now();

      if (timeLeft <= 0) {
        setSuccessPopUp(false);
        return; // Stop the animation when time is up
      }

      // Launch confetti from the left
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
      });

      // Launch confetti from the right
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
      });

      requestAnimationFrame(frame);
    };

    // Start the animation
    requestAnimationFrame(frame);

    // Set the button to disabled after 3 seconds
    setTimeout(() => {
      
      handleResetCards();
    }, duration);
  };

  useEffect(() => {
    handleResetCards();
  }, [gameSize]);

  useEffect(()=>{
    // console.log("test --",cards, flippedCards);
    if(flippedCards.length===2){

      if(cards[flippedCards[0]].val === cards[flippedCards[1]].val){

        setCards((prev)=>{
          prev[flippedCards[0]].isMatched = true;
          prev[flippedCards[1]].isMatched = true;
          return prev
        });
        setFlippedCards([]);
      }
      else{
        setTimeout(()=>{
          setCards((prev)=>{
            prev[flippedCards[0]].isFlipped = false;
            prev[flippedCards[1]].isFlipped = false;
            return prev
          });
          setFlippedCards([]);
        }, 1000)
      }

    }

    let allMatched = cards.every((ele)=>ele.isMatched === true);
    if(cards.length>0 && allMatched){
      // console.log("test -", allMatched, cards);
      let best_score = localStorage.getItem("best_score");
      if(best_score && !isNaN(parseFloat(best_score)) && parseFloat(best_score)>movesMade ){
        localStorage.setItem("best_score", movesMade);
      }
      handleConfetti();
      // setTimeout(()=>{
      //   handleResetCards();
      // }, 3000)
    }

  },[flippedCards, cards])

  const onCardClick = (ind) => {
    // console.log("test click", ind);
    if(flippedCards.length < 2 && !cards[ind].isMatched && !cards[ind].isFlipped){

      setCards((prev)=>{
        let newCards = [...prev]
        newCards[ind].isFlipped = true;
        return newCards
      });
      setFlippedCards((prev)=>([...prev, ind]));

      if(flippedCards.length === 1){
        setMovesMade((prev) => prev+1);
      }
    }
  };

  const onClickhowtoplay = ()=>{
    setHowToPlayModal(true);
  }

  return (
    <div>
      <div>
      {/* <div class="fixed inset-0 bg-gray-500/45 backdrop-blur-sm transition-opacity z-50" aria-hidden="true"></div> */}
        <div  className={`absolute inset-0 z-50 transition-opacity duration-1000 ${successPopUp ? "flex-center-items opacity-100" : "hidden opacity-0"}`}>
          <div className="flex-center-items px-8 py-6 mt-[-15%] bg-gray-500/45 shadow-2xl  rounded-lg backdrop-blur transition-opacity">
            <div className="text-2xl font-bold">You Won!!! Congratulations🎉🎉🎉</div>
          </div>
        </div>
        {/* <button onClick={handleConfetti}>HHh</button> */}
        <GameInfo bestScore={bestScore} score={movesMade} onReset={handleResetCards} onClickhowtoplay ={onClickhowtoplay}/>
      </div>
      {/* Game */}
      <div className="mt-10 flex-center-items ">
        <div className={`grid grid-cols-4 gap-4 lg:gap-6 max-w-screen-sm `}>
          {cards.length > 0 &&
            cards.map((ele, ind) => {
              return (
                <div
                  key={`game-key-${ind}`}
                  onClick={() => { onCardClick(ind);}}
                  className={`size-16 md:size-20 card ${(ele.isFlipped || ele.isMatched) ? "flipped": ""}`}
                >
                  <div className={`card-inner flex-center-items rounded-xl shadow-xl  ${ele.isFlipped ? (ele.isMatched ? "bg-emerald-600" : (flippedCards.length === 2 ? "bg-red-600" :"bg-sky-600")) : "bg-[#e5e7eb]" }`}>
                    <div className="card-front flex-center-items">? {ele.val }</div>
                    <div className="card-back flex-center-items">{ele.isFlipped ? ele.val : ""}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* How To Play Modal */}
      <Dialog
        open={howToPlayModal}
        TransitionComponent={Transition}
        onClose={()=> setHowToPlayModal(false)}
        sx={{background:"#00000080"}}
      >
        <DialogTitle className="flex flex-row justify-start items-center text-2xl"> 
          <Gamepad2 /> <span className="ml-1  font-bold">How to Play</span>
        </DialogTitle>
        <DialogContent >
          <div>
            <div className="text-xl font-bold flex flex-row justify-start items-center"> <Goal />Objective:</div>
            <div className="mt-1 ml-8">The goal is to match all pairs of cards as quickly and efficiently as possible.</div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold flex flex-row justify-start items-center"><CirclePlay /> Gameplay:</div>
            <ol className="list-decimal ml-12 mt-2">
              <li>Click on a card to flip it and reveal the hidden number.</li>
              <li>Click on another card to try and find its matching pair.</li>
              <li>If the cards match, they will remain flipped.</li>
              <li>If the cards do not match, they will flip back after a short delay.</li>
              <li>Continue flipping and matching cards until all pairs are found.</li>
              <li>The game is completed once all cards are matched.</li>
            </ol>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold flex flex-row justify-start items-center "> <Lightbulb />Tips:</div>
            <ul className="list-disc ml-12 mt-2">
              <li>Pay close attention to the cards you flip to remember their positions.</li>
              <li>Try to match pairs with the fewest possible moves.</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemoryGamePage;

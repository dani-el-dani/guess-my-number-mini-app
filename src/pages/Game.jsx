import { useState, useRef, useEffect } from "react";
import { getRandomNumber } from "../utils";
import Confetti from 'react-confetti'
import { useLaunchParams, isTMA } from "@tma.js/sdk-react";

function Game(){
    const [level, setLevel] = useState(4)
    const scrollRef = useRef(null)
    const [computerNumber, setComputerNumber] = useState(getRandomNumber(level))
    const [currentGuess, setCurrentGuess] = useState([])
    const [guesses, setGuesses] = useState([])
    const isGameEnd = guesses.length > 0 && guesses[guesses.length - 1].every((item, index) => item === computerNumber[index])
    if (isTMA()) {
        const launchParams = useLaunchParams()
        console.log(launchParams)

    }
    
    let currentGuessNumber = currentGuess.length === 0 ? "" : currentGuess.reduce((numberReturn,item,index) => 
        numberReturn += item * Math.pow(10, currentGuess.length - 1 - index)
    ,0)

    useEffect(()=>{
        if(scrollRef.current){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    },[guesses])

    const guessesdisplay = guesses.map((item,index) => (
        <tr key={index}>
            <td>{item}</td>
            <td>{item.reduce((crtDig, el)=>{
                if(computerNumber.includes(el))
                    crtDig++
                return crtDig
            },0)}</td>
            <td>{item.reduce((crtPos, el, i)=>{
                if(computerNumber[i] === el)
                    crtPos++
                return crtPos
            },0)}</td>
        </tr>
    ))
    
    const buttons = [1,2,3,4,5,6,7,8,9].map(number => (
        <button 
            key={number} 
            onClick={() => handleButonClick(number)} 
            disabled={currentGuess.includes(number) || currentGuess.length == level || isGameEnd}>
                {number}
            </button>
    ))

    function handleButonClick(number){
        const prev = currentGuess.slice();
        prev.push(number)
        setCurrentGuess(prev)
    }

    function handleBackButton(){
        if(currentGuess.length > 0){
            const prev = currentGuess.slice(0,currentGuess.length-1);
            setCurrentGuess(prev)
        }
    }

    function handleGuessButton(){
        const prevGuesses = guesses.slice()
        prevGuesses.push(currentGuess)
        setGuesses(prevGuesses)
        setCurrentGuess([])

    }

    function handleGameReset(){
        setComputerNumber(getRandomNumber(level))
        setCurrentGuess([])
        setGuesses([])
    }

    function handleLevelButton(n){
        setLevel(n)
        setComputerNumber(getRandomNumber(n))
        setCurrentGuess([])
        setGuesses([])
    }
    
    return(
        <>
            <main>
                {isGameEnd && <Confetti />}
                <h1>Guess the number game</h1>
                <div className="levels-container">
                    <h2>Level</h2>
                    <div className="level-btns-container">
                        <button className={level == 4 ? 'active-level-btn' : '' } onClick={() => handleLevelButton(4)}>4</button>
                        <button className={level == 5 ? 'active-level-btn' : '' } onClick={() => handleLevelButton(5)}>5</button>
                        <button className={level == 6 ? 'active-level-btn' : '' } onClick={() => handleLevelButton(6)}>6</button>
                    </div>
                </div>
                <div className="gussed-numbers-area">
                    <div ref={scrollRef} className="gussed-numbers-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Your guess</th>
                                    <th>Correct digits</th>
                                    <th>Correct positions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guessesdisplay}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="user-guess-container">
                    <p>{currentGuessNumber}</p>
                </div>
                <div className="button-container">
                    {buttons}
                    <button onClick={handleBackButton} disabled={isGameEnd}>X</button>
                    {isGameEnd
                        ?<button onClick={handleGameReset}>Replay</button>
                        :<button onClick={handleGuessButton} disabled={currentGuess.length < level}>Guess</button>
                    }
                </div>
            </main>

        </>
    )
}

export default Game;
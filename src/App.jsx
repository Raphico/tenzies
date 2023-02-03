import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import Die from "./components/Die"
import Confetti from "react-confetti"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  const [tenzies, setTenzies] = useState(false)
  const [dice, setDice] = useState(allNewDice())
  const [highScore, setHighScore] = useState(
      () => {
        return localStorage.getItem('Tenzies') || '0'
      }
    )
  const [rollCount, setRollCount] = useState(0)

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allHaveTheSameValue = dice.every(die => die.value === firstValue)

    if (allHeld && allHaveTheSameValue) {
      setTenzies(true)

      if (rollCount < highScore || highScore === '0') {
        setHighScore(rollCount)
        localStorage.setItem('Tenzies', rollCount)
        toast.success('New High Score!')
      }
    } else {
      toast.error('Dice are not the Same! Try again')
      setDice(allNewDice())
    }
  }, [dice])

  function allNewDice() {
    const diceArray = []

    for (let i = 0; i < 10; i++) {
      diceArray.push(generateRandomDie())
    }

    return diceArray
  }

  function generateRandomDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false
    }
  }

  function rollDice() {
    if (tenzies) {
      reset()
      return
    }

    setDice(oldDice => oldDice.map(oldDie => 
      oldDie.isHeld ? 
      { ...oldDie, isHeld: oldDie.isHeld}
      : generateRandomDie()
    )) 
    setRollCount(oldCount => oldCount + 1)
  }
  
  function reset() {
    setDice(allNewDice())
    setTenzies(false)
    setRollCount(0)
  }

  function holdDie(id) {
    setDice(oldDice => oldDice.map(oldDie => 
      oldDie.id === id ?
      { ...oldDie, isHeld: !oldDie.isHeld }
      : oldDie
    ))
  }

  const diceElements = dice.map(die => <Die 
    key={die.id}
    holdDie={() => holdDie(die.id)}
    value={die.value}
    isHeld={die.isHeld}
  />)
  
  return (
    <>
      <div className="container">
        <h1 className="fs-large fw-bold">Tenzies</h1>
        <p>
          Tenzy is a dice racing game with the
          aim of the player to roll of ten dice 
          to the same numbers
        </p>

        <div className="scores">
          <p className="fw-bold">High Score: {highScore}</p>
          <p className="fw-bold">Dice Rolled: {rollCount}</p>
        </div>

        <div className="dice-container">
          {diceElements}
        </div>

        <button 
          className="roll"
          onClick={rollDice}
        >
          <img src="/roll.svg" alt="dice" />
        </button>
      </div>

      {tenzies && <Confetti />}
      
      <ToastContainer />
    </>
  )
}

export default App
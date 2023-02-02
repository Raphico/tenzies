function Die({ holdDie, isHeld, value }) {
  const style = {
    border: isHeld && '5px solid #fff'
  }

  return <button 
    onClick={holdDie}
    className="die" 
    style={style}
    >
      <img src={`/die-${value}.svg`} alt="" />
    </button>
}

export default Die
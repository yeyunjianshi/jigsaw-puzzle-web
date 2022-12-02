type OperationsProp = {
  data: PuzzleData
  shuffle: () => void
  setStarted: (s: boolean) => void
  reset: () => void
}

export default function Operations({
  data,
  shuffle,
  setStarted,
  reset,
}: OperationsProp) {
  const selectPictureHandler = () => {}
  const startHandler = () => {
    shuffle()
    setStarted(true)
  }
  const resetHandler = () => {
    reset()
  }
  return (
    <div className="button-group">
      {/* <button className="button" onClick={selectPictureHandler}>
        选择图片
      </button> */}
      <button
        className="button"
        onClick={startHandler}
        disabled={data.isStarted}
      >
        开始
      </button>
      <button className="button" onClick={resetHandler}>
        重置
      </button>
    </div>
  )
}

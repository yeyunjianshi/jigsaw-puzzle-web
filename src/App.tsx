import { useState } from 'react'
import Puzzle from './components/Puzzle'
import DefaultImage from './assets/default.jpg'
import { equalArray, vector2Add } from './util'
import Operations from './components/Operations'

const DefaultSides = 3

function usePuzzleData() {
  const startStatusFunc = (sides: number) =>
    Array(sides * sides)
      .fill(1)
      .map((_, i) => i)

  const [data, setData] = useState<PuzzleData>({
    sides: DefaultSides,
    imageSrc: DefaultImage,
    isStarted: false,
    status: startStatusFunc(DefaultSides),
    emptyIndex: DefaultSides * DefaultSides - 1,
  })

  const setStatus = (status: number[], checkFinished = true) => {
    if (equalArray(status, data.status)) return

    if (checkFinished && equalArray(status, startStatusFunc(data.sides))) {
      alert('恭喜您成功完成了！！！')
    }

    setData((data) => ({
      ...data,
      ...{
        status,
        isStarted:
          data.isStarted && !equalArray(status, startStatusFunc(data.sides)),
      },
    }))
  }
  const setSides = (sides: number) => {
    if (data.sides === sides) return
    setData((data) => ({
      ...data,
      ...{ sides, emptyIndex: sides * sides - 1 },
    }))
  }

  const setStarted = (s: boolean) => {
    setData((data) => ({ ...data, ...{ isStarted: s } }))
  }

  const setImageSrc = (src: string) => {
    if (src === data.imageSrc) return
    setData((data) => ({ ...data, ...{ imageSrc: src } }))
  }

  const shuffle = () => {
    const sides = data.sides
    const positions: Array<Array<number>> = []

    for (let i = 0; i < sides; i++) {
      positions.push([])
      for (let j = 0; j < sides; j++) {
        positions[i].push(i * sides + j)
      }
    }
    let coord: Vector2 = [sides - 1, sides - 1]

    const times = sides * sides * 10
    const directions: Vector2[] = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
    for (let i = 0; i < times; i++) {
      const canMoveDirections = directions.filter(
        (dir) =>
          dir[0] + coord[0] < sides &&
          dir[0] + coord[0] >= 0 &&
          dir[1] + coord[1] < sides &&
          dir[1] + coord[1] >= 0
      )
      const moveDirection =
        canMoveDirections[Math.floor(Math.random() * canMoveDirections.length)]

      const nextCoord = vector2Add(coord, moveDirection)

      ;[positions[coord[0]][coord[1]], positions[nextCoord[0]][nextCoord[1]]] =
        [positions[nextCoord[0]][nextCoord[1]], positions[coord[0]][coord[1]]]

      coord = nextCoord
    }

    const status = positions.reduce((ret, v) => {
      ret.push(...v)
      return ret
    }, [])

    setStatus(status, false)
  }

  const reset = () => {
    setData((data) => ({
      ...data,
      ...{ isStarted: false, status: startStatusFunc(data.sides) },
    }))
  }

  return {
    data,
    setStatus,
    setSides,
    setStarted,
    reset,
    shuffle,
    setImageSrc,
  }
}

function App() {
  const { data, setStatus, setStarted, setImageSrc, setSides, reset, shuffle } =
    usePuzzleData()
  return (
    <>
      <Operations
        data={data}
        setStarted={setStarted}
        setImageSrc={setImageSrc}
        setSides={setSides}
        reset={reset}
        shuffle={shuffle}
      />
      <Puzzle puzzleData={data} setStatus={setStatus} />
    </>
  )
}

export default App

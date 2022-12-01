import { useState } from 'react'
import Puzzle from './components/Puzzle'
import DefaultImage from './assets/default.jpg'
import './App.css'

type PuzzleData = {
  sides: number
  imageSrc: string
  status: number[]
}

const DefaultSides = 3

function usePuzzleData() {
  const [data, setData] = useState<PuzzleData>({
    sides: DefaultSides,
    imageSrc: DefaultImage,
    status: Array(DefaultSides * DefaultSides)
      .fill(1)
      .map((_, i) => i),
  })

  const setStatus = (status: number[]) => {
    if (
      status.length === data.status.length &&
      status.every((v, i) => v === data.status[i])
    )
      return

    setData({ ...data, ...{ status } })
  }
  const setSides = (sides: number) => {
    if (data.sides === sides) return
    setData({ ...data, ...{ sides } })
  }

  return {
    data,
    setStatus,
    setSides,
  }
}

function App() {
  const { data, setStatus } = usePuzzleData()
  return (
    <Puzzle
      sides={data.sides}
      imageSrc={data.imageSrc}
      status={data.status}
      setStatus={setStatus}
    ></Puzzle>
  )
}

export default App

/// <reference types="vite/client" />

type Vector2 = [number, number]

type PuzzleData = {
  sides: number
  imageSrc: string
  isStarted: boolean
  status: number[]
  emptyIndex: number
}

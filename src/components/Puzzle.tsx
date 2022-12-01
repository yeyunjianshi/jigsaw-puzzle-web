import { useEffect, useRef, useState } from 'react'
import { distance, lerp, lerpVector2 } from '../util'

type PuzzleProps = {
  sides?: number
  imageSrc: string
  status: number[]
  setStatus?: (status: number[]) => void
}
type PuzzleState = {
  sides: number
  data: PuzzlePart[]
  image?: HTMLImageElement
}
type PuzzlePart = {
  index: number
  data: string
  isEmpty: boolean
}

function loadImage(url: string) {
  const image = new Image()
  image.src = url
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    image.addEventListener('load', () => {
      resolve(image)
    })
    image.addEventListener('error', (e) => {
      reject(e)
    })
  })
  return promise
}

function getImageParts(
  image: HTMLImageElement,
  sides: number,
  options: { width?: number; height?: number; emptyPartIndex?: number } = {}
): PuzzlePart[] {
  const width = options.width || image.width
  const height = options.height || image.height

  const emptyPartIndex = options.emptyPartIndex || sides * sides - 1

  const partWidth = Math.min(width, height) / sides
  const partHeight = Math.min(width, height) / sides

  const canvas = document.createElement('canvas')
  canvas.width = partWidth
  canvas.height = partHeight

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const parts = [] as PuzzlePart[]

  for (let row = 0; row < sides; row++) {
    for (let col = 0; col < sides; col++) {
      const index = row * sides + col
      const isEmptyPartIndex = emptyPartIndex === index
      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        isEmptyPartIndex ? new Image() : image,
        partHeight * col,
        partWidth * row,
        partWidth,
        partHeight,
        0,
        0,
        partWidth,
        partHeight
      )
      parts.push({
        index,
        data: canvas.toDataURL(),
        isEmpty: isEmptyPartIndex,
      })
      ctx.restore()
    }
  }
  return parts
}

const DefaultPuzzleContinerLength = 600
const DefaultSlideAnimationSpeed = 600

function slideAnimation(
  element: HTMLElement,
  startPosition: Vector2,
  targetPosition: Vector2,
  callback?: () => void
) {
  let offset = startPosition
  let startTime = -1

  const animation = (time: number) => {
    if (startTime === -1) startTime = time

    let isEndMarker = false
    if (distance(offset, targetPosition) > 0.1) {
      offset = lerpVector2(
        startPosition,
        targetPosition,
        ((time - startTime) * DefaultSlideAnimationSpeed) / 1000
      )
    } else {
      offset = targetPosition
      isEndMarker = true
    }

    element.style.translate = `${offset[0]}px ${offset[1]}px`

    if (isEndMarker) {
      callback && callback()
    } else {
      requestAnimationFrame(animation)
    }
  }
  requestAnimationFrame(animation)
}

function positionToCoord(index: number, sides: number): Vector2 {
  return [index % sides, Math.floor(index / sides)]
}

const Puzzle = ({ sides = 3, imageSrc, setStatus, status }: PuzzleProps) => {
  const isSlidingAnimationRef = useRef(false)
  const [data, setData] = useState<PuzzleState>({ sides, data: [] })
  const [length, setLength] = useState(DefaultPuzzleContinerLength)
  const partLength = length / sides

  useEffect(() => {
    loadImage(imageSrc)
      .then((image) => {
        setData({ sides, image, data: getImageParts(image, sides) })
      })
      .catch((e) => {
        console.log(e)
      })
  }, [sides, imageSrc])

  useEffect(() => {}, [length])

  const clickHandler = (element: HTMLElement, partData: PuzzlePart) => {
    if (isSlidingAnimationRef.current) return

    const emptyPartData = data.data.find((d) => d.isEmpty)
    if (!emptyPartData) throw new Error(`Program Error: Please Reset`)

    const emptyCoord = positionToCoord(
      status.findIndex((n) => n === emptyPartData.index) as number,
      sides
    )
    const partCoord = positionToCoord(
      status.findIndex((n) => n === partData.index) as number,
      sides
    )

    if (distance(emptyCoord, partCoord) === 1) {
      const targetPosition: Vector2 = [
        (emptyCoord[0] - partCoord[0]) * partLength,
        (emptyCoord[1] - partCoord[1]) * partLength,
      ]
      isSlidingAnimationRef.current = true
      slideAnimation(element, [0, 0], targetPosition, () => {
        const slideAfterStatus = status.map((v) =>
          v === partData.index
            ? emptyPartData.index
            : v === emptyPartData.index
            ? partData.index
            : v
        )
        isSlidingAnimationRef.current = false
        setStatus && setStatus(slideAfterStatus)
      })
    }
  }

  return (
    <ul
      className="container"
      style={{ width: `${length}px`, height: `${length}px` }}
    >
      {status.map((num) => {
        const partData = data.data.find((d) => d.index === num)

        if (!partData) return null
        return (
          <li
            key={`{Date()}${Math.random()}}`}
            style={{
              width: `${length / sides}px`,
              height: `${length / sides}px`,
              translate: '0px 0px',
            }}
            onClick={(event) => clickHandler(event.currentTarget, partData)}
          >
            <img src={partData.data} />
          </li>
        )
      })}
    </ul>
  )
}

export default Puzzle

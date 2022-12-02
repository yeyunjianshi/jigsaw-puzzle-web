import { ChangeEvent, useRef } from 'react'

type OperationsProp = {
  data: PuzzleData
  shuffle: () => void
  setStarted: (s: boolean) => void
  setImageSrc: (s: string) => void
  reset: () => void
}

async function loadLocalImage(dataUrl: Blob): Promise<string> {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        resolve(e.target.result.toString())
      } else {
        reject(new Error(`load local image error.`))
      }
    })
    reader.addEventListener('error', (e) => {
      reject(e)
    })
    reader.readAsDataURL(dataUrl)
  })
}

export default function Operations({
  data,
  shuffle,
  setStarted,
  setImageSrc,
  reset,
}: OperationsProp) {
  const fileRef = useRef<HTMLInputElement | null>()
  const selectPictureHandler = () => {
    fileRef.current?.click()
  }
  const changeHandler = async () => {
    if (
      !fileRef.current ||
      !fileRef.current.files ||
      fileRef.current.files.length === 0
    )
      return

    const imageUrl = await loadLocalImage(fileRef.current.files[0])
    setImageSrc(imageUrl)
  }
  const startHandler = () => {
    shuffle()
    setStarted(true)
  }
  const resetHandler = () => {
    reset()
  }
  return (
    <div className="button-group">
      <input
        ref={(ref) => (fileRef.current = ref)}
        type="file"
        id="imageUpload"
        accept="image/jpg,image/jpeg,image/gif,image/png"
        style={{ display: 'none' }}
        onChange={changeHandler}
      />
      <button className="button" onClick={selectPictureHandler}>
        选择图片
      </button>
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

"use client"

import { Button, Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import axios from "axios"
import styles from "./page.module.css"

let startPixels = 0
let startTime: Date | null = null
let isDrawing = false
let isStopped = false

export default function DrawCircle() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvasSize, setCanvasSize] = useState(1000)
  const [leftTime, setLeftTime] = useState("03:00")
  const [score, setScore] = useState(-1)
  const [rank, setRank] = useState(-1)

  useEffect(() => {
    const windowSize = global.window.innerHeight
    setCanvasSize(windowSize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 기본 비어 있는 하얀 원 그리기
    ctx.strokeStyle = "white"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(
      canvas.width / 2,
      canvas.height / 1.5,
      canvasSize / 5,
      0,
      Math.PI * 2
    )
    ctx.stroke()

    const startDrawing = (event: MouseEvent | TouchEvent) => {
      if (isStopped) return
      isDrawing = true
      const { x, y } = getCanvasCoordinates(event, canvas)
      ctx.beginPath()
      startTime = new Date()
      ctx.moveTo(x, y)
      const callBack = () => {
        let diff = 3 * 1000 - dayjs().diff(dayjs(startTime), "millisecond")
        if (diff < 0) {
          diff = 0
        }
        const milliseconds = Math.floor((diff % 1000) / 10)
        const seconds = Math.floor(diff / 1000)
        setLeftTime(
          `${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(
            2,
            "0"
          )}`
        )

        if (diff <= 0) {
          stopDrawing()
          stopInterval()
        }
      }
      const setIntervalId = setInterval(callBack, 10)
      function stopInterval() {
        clearInterval(setIntervalId)
      }
    }

    const draw = (event: MouseEvent | TouchEvent) => {
      if (!isDrawing) return
      if (isStopped) return
      const { x, y } = getCanvasCoordinates(event, canvas)

      // 그라데이션 생성
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      )
      gradient.addColorStop(0, "red")
      gradient.addColorStop(0.5, "blue")
      gradient.addColorStop(1, "green")

      ctx.lineTo(x, y)
      ctx.strokeStyle = gradient // 그라데이션 적용
      ctx.lineWidth = 10
      ctx.stroke()
    }

    const getWhitePixelCount = () => {
      if (!canvas || !ctx) return 0
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      let whitePixelCount = 0

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
        if (r === 255 && g === 255 && b === 255 && a === 255) {
          whitePixelCount++
        }
      }

      return whitePixelCount
    }

    setTimeout(() => {
      startPixels = getWhitePixelCount()
    }, 500)
    const stopDrawing = async () => {
      if (isStopped) return
      isStopped = true
      ctx.closePath()
      const percentage = Math.round((getWhitePixelCount() / startPixels) * 100)
      const score = 100 - percentage
      const { data } = await axios.post(
        "http://iubns.net:7000/game/draw-circle",
        {
          point: score,
        }
      )
      setRank(data.rank)

      setScore(score)
    }

    const getCanvasCoordinates = (
      event: MouseEvent | TouchEvent,
      canvas: HTMLCanvasElement
    ) => {
      const rect = canvas.getBoundingClientRect()
      const clientX =
        event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
      const clientY =
        event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }
    }

    // 이벤트 리스너 등록
    canvas.addEventListener("mousedown", startDrawing)
    canvas.addEventListener("mousemove", draw)
    canvas.addEventListener("mouseup", stopDrawing)
    canvas.addEventListener("mouseout", stopDrawing)

    canvas.addEventListener("touchstart", startDrawing)
    canvas.addEventListener("touchmove", draw)
    canvas.addEventListener("touchend", stopDrawing)
    canvas.addEventListener("touchcancel", stopDrawing)

    // 클린업
    return () => {
      canvas.removeEventListener("mousedown", startDrawing)
      canvas.removeEventListener("mousemove", draw)
      canvas.removeEventListener("mouseup", stopDrawing)
      canvas.removeEventListener("mouseout", stopDrawing)

      canvas.removeEventListener("touchstart", startDrawing)
      canvas.removeEventListener("touchmove", draw)
      canvas.removeEventListener("touchend", stopDrawing)
      canvas.removeEventListener("touchcancel", stopDrawing)
    }
  }, [canvasSize])

  function reset() {
    global.window.location.reload()
  }

  return (
    <Stack
      width="100vw"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      bgcolor="#0E0F27"
      style={{
        touchAction: "none",
      }}
    >
      <Stack
        color="white"
        fontSize="5rem"
        zIndex="100"
        position="absolute"
        top="10vh"
      >
        {leftTime}
      </Stack>
      {score !== -1 && (
        <Stack
          top="30vh"
          zIndex="100"
          color="white"
          fontSize="3rem"
          textAlign="center"
          position="absolute"
          className={styles["score-area"]}
        >
          점수: {score}
          <Stack>상위 {rank}%</Stack>
        </Stack>
      )}
      <Stack>
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize}></canvas>
      </Stack>
      {isStopped && (
        <Button
          onClick={() => {}}
          style={{
            position: "absolute",
            bottom: "10vh",
            zIndex: 100,
          }}
        >
          <Stack
            bgcolor="rgb(55, 108, 185)"
            color="white"
            borderRadius="30px"
            width="200px"
            height="50px"
            alignItems="center"
            justifyContent="center"
            fontSize="20px"
            className={styles["score-area"]}
            onClick={reset}
          >
            다시 하기
          </Stack>
        </Button>
      )}
    </Stack>
  )
}

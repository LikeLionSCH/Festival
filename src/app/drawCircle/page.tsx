"use client"

import { Stack } from "@mui/material"
import { useEffect, useRef } from "react"

export default function DrawCircle() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 기본 비어 있는 하얀 원 그리기
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2)
    ctx.stroke()

    let isDrawing = false

    const startDrawing = (event: MouseEvent | TouchEvent) => {
      isDrawing = true
      const { x, y } = getCanvasCoordinates(event, canvas)
      ctx.beginPath()
      ctx.moveTo(x, y)
    }

    const draw = (event: MouseEvent | TouchEvent) => {
      if (!isDrawing) return
      const { x, y } = getCanvasCoordinates(event, canvas)
      ctx.lineTo(x, y)
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    const stopDrawing = () => {
      isDrawing = false
      ctx.closePath()
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

    // 하얀 픽셀 개수 계산 함수
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

      console.log(`White Pixel Count: ${whitePixelCount}`)
      return whitePixelCount
    }
    setTimeout(() => {
      getWhitePixelCount()
    }, 1000)

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
  }, [])

  return (
    <Stack
      width="100vw"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      bgcolor="black"
    >
      <canvas ref={canvasRef}></canvas>
      <button
        style={{
          position: "absolute",
          bottom: "20px",
          padding: "10px 20px",
          backgroundColor: "white",
          color: "black",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Count White Pixels
      </button>
    </Stack>
  )
}

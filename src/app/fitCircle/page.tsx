"use client"

import { Stack } from "@mui/material"
import { useState } from "react"
import styles from "./page.module.css"
import confetti from "canvas-confetti"

export default function FitCircle() {
  const [targetSize, setTargetSize] = useState(400)
  const [circleSize, setCircleSize] = useState(100)
  const [position, setPosition] = useState("98")
  const [movingStartTime, setMovingStartTime] = useState<Date | null>(null)
  const [isMoving, setIsMoving] = useState(false)
  const [step, setStep] = useState(1)

  function moveCircle() {
    setPosition("0")
    setMovingStartTime(new Date())
    setIsMoving(true)
  }

  function stopCircle() {
    if (!movingStartTime) return
    if (!isMoving) return
    setIsMoving(false)
    const movingEndTime = new Date()
    const movingTime = movingEndTime.getTime() - movingStartTime.getTime()
    const movingDistance = (movingTime / 10) * -1 + circleSize
    const newPosition = parseFloat(position) + movingDistance

    setPosition(newPosition.toString())

    const targetCircleCenter = targetSize / 2 + global.window.innerWidth * 0.15
    const circleCenter =
      (global.window.innerWidth * newPosition) / 100 - circleSize / 2

    if (
      targetCircleCenter + targetSize / 2 >= circleCenter + circleSize / 2 &&
      targetCircleCenter - targetSize / 2 <= circleCenter - circleSize / 2
    ) {
      firework()
      setTimeout(() => {
        resetCircle()
        changeStep(step + 1)
      }, 1000)
    } else {
      alert("실패 ㅠㅠ")
      setTimeout(() => {
        resetCircle()
      }, 1000)
    }
  }

  function resetCircle() {
    setTargetSize(400)
    setCircleSize(100)
    setPosition("98")
    setMovingStartTime(null)
    setIsMoving(false)
    setStep(1)
  }

  function changeStep(step: number) {
    setStep(step)
    switch (step) {
      case 1:
        setTargetSize(400)
      case 2:
        setTargetSize(300)
        break
      case 3:
        setTargetSize(200)
        break
      case 4:
        setTargetSize(150)
        break
      case 5:
        setTargetSize(120)
        break
      default:
        break
    }
  }

  function touchScreen() {
    if (isMoving) {
      stopCircle()
    } else {
      moveCircle()
    }
  }

  function firework() {
    const duration = 15 * 100
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 }
    //  startVelocity: 범위, spread: 방향, ticks: 갯수

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      )
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      )
    }, 250)
  }

  return (
    <Stack
      width="100vw"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      onTouchStart={touchScreen}
    >
      <Stack position="absolute" top="10vh" fontSize="40px" fontWeight="bold">
        {step}단계
      </Stack>
      <Stack
        borderRadius={targetSize / 2 + "px"}
        border="4px solid black"
        width={targetSize + "px"}
        height={targetSize + "px"}
        position="absolute"
        left="15vw"
      />
      <Stack
        style={{
          transition: isMoving ? "left 1s linear" : "none",
        }}
        borderRadius={circleSize / 2 + "px"}
        border="4px solid red"
        width={circleSize + "px"}
        height={circleSize + "px"}
        position="absolute"
        left={`calc(${position}vw - ${circleSize}px)`}
      />{" "}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles.firework}></div>
      ))}
    </Stack>
  )
}

"use client"

import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import GameModal from "../drawCircle/GameModal"

export default function FitCircle() {
  const [step, setStep] = useState(1)
  const [isWin, setIsWin] = useState(false)
  const [position, setPosition] = useState("98")
  const [targetSize, setTargetSize] = useState(0)
  const [circleSize, setCircleSize] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [movingStartTime, setMovingStartTime] = useState<Date | null>(null)
  const [diff, setDiff] = useState(0)

  useEffect(() => {
    resetCircle()
  }, [])

  useEffect(() => {
    if (!!gameOver) return
    resetCircle()
  }, [gameOver])

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
    const movingDistance = 100 - movingTime / 10
    const newPosition = parseFloat(position) + movingDistance

    setPosition(newPosition.toString())

    const targetCircleCenter = targetSize / 2 + global.window.innerWidth * 0.15
    const circleCenter =
      (global.window.innerWidth * newPosition) / 100 - circleSize / 2

    setDiff(Math.abs(targetCircleCenter - circleCenter))
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
      setTimeout(() => {
        setGameOver(true)
      }, 2000)
    }
  }

  function resetCircle() {
    if (!global || !global.window) return
    const windowSize = global.window.innerWidth
    setCircleSize(windowSize * 0.1)
    setTargetSize(windowSize * 0.4)
    setPosition("98")
    setMovingStartTime(null)
    setIsMoving(false)
    setStep(1)
    setIsWin(false)
  }

  function changeStep(step: number) {
    if (step > 5) {
      setGameOver(true)
      setIsWin(true)
      setStep(step)
      return
    }
    setStep(step)
    const windowSize = global.window.innerWidth
    switch (step) {
      case 1:
        setTargetSize(windowSize * 0.4)
      case 2:
        setTargetSize(windowSize * 0.3)
        break
      case 3:
        setTargetSize(windowSize * 0.2)
        break
      case 4:
        setTargetSize(windowSize * 0.15)
        break
      case 5:
        setTargetSize(windowSize * 0.12)
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
      <Stack position="absolute" top="10vh" fontSize="5vh" fontWeight="bold">
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
      />
      <GameModal
        open={gameOver}
        setOpen={setGameOver}
        step={step}
        distance={diff}
        isWin={isWin}
      />
    </Stack>
  )
}

"use client"
import { Button, Modal, Stack } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

export default function GameModal({
  open,
  isWin,
  setOpen,
  step,
  distance,
}: {
  open: boolean
  isWin: boolean
  setOpen: (open: boolean) => void
  step: number
  distance: number
}) {
  const [rank, setRank] = useState(0)
  useEffect(() => {
    setRank(0)
    if (!open) return
    getRank()
  }, [open])

  async function getRank() {
    const { data } = await axios.post("http://iubns.net:7000/game/fit-circle", {
      level: step,
      distance: distance,
    })
    const targetNumber = data.rank
    for (let index = 0; index < targetNumber; index += targetNumber / 30) {
      setTimeout(() => {
        setRank(Number.parseFloat(index.toFixed(2)))
      }, 20 * index)
    }
  }
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack
        width="100vw"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <Stack
          bgcolor="white"
          borderRadius="30px"
          width="400px"
          height="300px"
          alignItems="center"
          justifyContent="center"
          gap="40px"
        >
          <Stack fontSize="30px" fontWeight="bold">
            {isWin ? "모두 성공!" : "원 맞추기 실패!"}
          </Stack>
          <Stack textAlign="center" fontSize="20px" fontWeight="500">
            상위 {rank}%
            <br />두 원의 거리는 {distance.toFixed(2)} 입니다.
          </Stack>
          <Button>
            <Stack
              bgcolor="black"
              color="white"
              borderRadius="30px"
              width="200px"
              height="50px"
              alignItems="center"
              justifyContent="center"
              fontSize="20px"
              onClick={() => {
                setOpen(false)
              }}
            >
              다시 도전하기
            </Stack>
          </Button>
        </Stack>
      </Stack>
    </Modal>
  )
}

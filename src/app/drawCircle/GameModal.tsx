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
    if (!open) return
    getRank()
  }, [open])

  async function getRank() {
    const { data } = await axios.post("http://iubns.net:7000/game/fit-circle", {
      level: step,
      distance: distance,
    })
    console.log(data.rank)
    setRank(data.rank)
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
          <Stack fontSize="20px" fontWeight="500">
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

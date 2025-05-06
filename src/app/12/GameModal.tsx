"use client"
import { Button, Modal, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import useLogic from "./useLogic"

export default function GameModal() {
  const { resetBoard, whoWin, userTeam } = useLogic()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [whoWin])

  if (!whoWin) {
    return null
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false)
        resetBoard()
      }}
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
            {whoWin === userTeam ? (
              <div>당신이 이겼습니다!</div>
            ) : (
              <div>인공지능이 이겼습니다!</div>
            )}
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
                resetBoard()
              }}
            >
              다시 시작하기
            </Stack>
          </Button>
        </Stack>
      </Stack>
    </Modal>
  )
}

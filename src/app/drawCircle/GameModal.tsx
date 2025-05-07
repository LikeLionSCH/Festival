"use client"
import { Button, Modal, Stack } from "@mui/material"

export default function GameModal({
  open,
  isWin,
  setOpen,
}: {
  open: boolean
  isWin: boolean
  setOpen: (open: boolean) => void
}) {
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

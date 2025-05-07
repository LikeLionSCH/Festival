"use client"
import { Button, Modal, Stack } from "@mui/material"
import useLogic from "./useLogic"

export default function SelectGameMode({
  gameMode,
  setGameMode,
}: {
  setGameMode: (mode: "AI" | "User") => void
  gameMode: "AI" | "User" | false
}) {
  const { setUserTeam } = useLogic()

  return (
    <Modal
      open={!gameMode}
      onClose={() => {}}
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
          height="500px"
          alignItems="center"
          justifyContent="center"
          gap="40px"
        >
          <Stack fontSize="30px" fontWeight="bold">
            게임 모드를 선택하세요
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
                setGameMode("User")
              }}
            >
              멋사 운영진과 대전
            </Stack>
          </Button>
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
                setGameMode("AI")
                setUserTeam("up")
              }}
            >
              AI 선공
            </Stack>
          </Button>
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
                setGameMode("AI")
                setUserTeam("down")
              }}
            >
              AI 후공
            </Stack>
          </Button>
        </Stack>
      </Stack>
    </Modal>
  )
}

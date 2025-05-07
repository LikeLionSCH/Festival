"use client"

import { useEffect, useState } from "react"
import useLogic from "./useLogic"
import { Alert, Snackbar, Stack } from "@mui/material"
import Cell, { CellSize } from "./cell"
import GameModal from "./GameModal"
import SelectGameMode from "./SelectGameMode"

type Position = {
  row: number
  col: number
}
export default function Page() {
  const {
    pieces,
    predictAI,
    movePiece,
    turn,
    isCanMove,
    setIsCanMove,
    getPieceFromPosition,
    userTeam,
  } = useLogic()

  const [gameMode, setGameMode] = useState<"AI" | "User" | false>(false)

  const [startPosition, setStartPosition] = useState<Position>({
    row: -1,
    col: -1,
  })

  useEffect(() => {
    if (pieces.length === 0) {
      return
    }
    if (turn !== userTeam && gameMode === "AI") {
      predictAI()
    }
  }, [turn, pieces, gameMode])

  function handleCellClick(row: number, col: number) {
    if (gameMode === "AI" && turn !== userTeam) {
      // AI 턴일 때는 클릭 무시
      return
    }
    if (startPosition.row !== -1 && startPosition.col !== -1) {
      // 두 번째 클릭: 이동할 위치 설정
      const { row: startRow, col: startCol } = startPosition
      movePiece(startRow, startCol, row, col)
      setStartPosition({ row: -1, col: -1 }) // 시작 위치 초기화
      return
    }

    // 첫 번째 클릭: 시작 위치 설정
    const startPiece = getPieceFromPosition(row, col)
    if (startPiece === null) {
      return
    }
    if (startPiece.team !== turn) {
      return
    }
    setStartPosition({ row, col })
  }

  // 클릭용보드랑 보여주기 보드 2개
  function Board({ canClick }: { canClick: boolean }) {
    return (
      <Stack zIndex={canClick ? 10 : 0}>
        {new Array(8).fill(0).map((_, row) => {
          return new Array(3).fill(0).map((_, col) => {
            let boardColor = ""
            if (!canClick) {
              // 클릭 할 수 있을때 색 있음 안보임
              boardColor = "rgb(254, 251, 220)"
            }
            let rowIndex = row
            if (row === 0 || row === 1) {
              rowIndex = row - 1
            }
            if (row === 6 || row === 7) {
              rowIndex = row + 1
            }
            if (row === 2 && !canClick) {
              boardColor = "#ABDEEE"
            }
            if (row === 5 && !canClick) {
              boardColor = "#B6CfB6"
            }
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  position: "absolute",
                  border: canClick ? "" : "1px dashed black",
                  width: `${CellSize}px`,
                  height: `${CellSize}px`,
                  left: `${col * CellSize}px`,
                  top: `${rowIndex * CellSize}px`,
                  backgroundColor: boardColor,
                }}
                onClick={() => handleCellClick(row, col)}
              ></div>
            )
          })
        })}
      </Stack>
    )
  }

  function SelectedPosition() {
    if (startPosition.row === -1 && startPosition.col === -1) {
      return null
    }
    let row = startPosition.row
    if (row === 0 || row === 1) {
      row = startPosition.row - 1
    }
    if (row === 6 || row === 7) {
      row = startPosition.row + 1
    }
    return (
      <Stack
        position="absolute"
        zIndex={20}
        width={CellSize + "px"}
        height={CellSize + "px"}
        left={startPosition.col * CellSize + "px"}
        top={row * CellSize + "px"}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      ></Stack>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isCanMove}
        onClose={() => setIsCanMove(false)}
      >
        <Alert severity="error">이동할 수 없습니다</Alert>
      </Snackbar>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: CellSize * 3 + "px",
          height: CellSize * 10 + "px",
        }}
      >
        <Stack
          width={CellSize * 3 + "px"}
          position="relative"
          height={CellSize * 8 + "px"}
        >
          {pieces.map((piece) => {
            return <Cell key={piece.key} piece={piece} />
          })}
          <Board canClick={true} />
          <Board canClick={false} />
          <SelectedPosition />
          {!gameMode && (
            <SelectGameMode gameMode={gameMode} setGameMode={setGameMode} />
          )}
          {gameMode}
        </Stack>
      </div>
      <GameModal />
    </div>
  )
}

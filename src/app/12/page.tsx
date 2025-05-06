"use client"

import { useEffect, useState } from "react"
import useLogic, { Piece } from "./useLogic"
import { Snackbar, Stack } from "@mui/material"

type Position = {
  row: number
  col: number
}

const cellSize = 100 // 각 셀의 크기 (가로, 세로)

export default function Page() {
  const { pieces, predictAI, movePiece, turn, isCanMove, setIsCanMove } =
    useLogic()
  const [startPosition, setStartPosition] = useState<Position>({
    row: -1,
    col: -1,
  })

  useEffect(() => {
    if (pieces.length === 0) {
      return
    }
    if (turn === "up") {
      predictAI()
    }
  }, [turn, pieces])

  function getKrFromPid(pid: number): string | null {
    if (pid === 0) {
      return "장"
    } else if (pid === 1) {
      return "왕"
    } else if (pid === 2) {
      return "상"
    } else if (pid === 3) {
      return "자"
    } else if (pid === 4) {
      return "후"
    } else if (pid === 5) {
      return "자"
    } else if (pid === 6) {
      return "상"
    } else if (pid === 7) {
      return "왕"
    } else if (pid === 8) {
      return "장"
    } else if (pid === 9) {
      return "후"
    } else {
      return null
    }
  }

  function handleCellClick(row: number, col: number) {
    console.log("clicked", row, col)
    if (startPosition.row === -1 && startPosition.col === -1) {
      // 첫 번째 클릭: 시작 위치 설정
      setStartPosition({ row, col })
    } else {
      // 두 번째 클릭: 이동할 위치 설정
      const { row: startRow, col: startCol } = startPosition
      movePiece(startRow, startCol, row, col)
      setStartPosition({ row: -1, col: -1 }) // 시작 위치 초기화
    }
  }

  function Cell({ piece }: { piece: Piece }) {
    const { row, col, pieceId } = piece
    if (row === 0 || row === 1 || row === 6 || row === 7) {
    }
    const krName = getKrFromPid(pieceId)
    if (piece) {
      return (
        <div
          onClick={() => handleCellClick(row, col)}
          key={`${piece.key}`}
          style={{
            position: "absolute",
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            backgroundColor: piece.team === "up" ? "red" : "green",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            left: `${col * cellSize}px`,
            top: `${row * cellSize}px`,
            transition: "all 1s linear",
          }}
        >
          <img
            style={{
              width: `${cellSize - 10}px`,
              height: `${cellSize - 10}px`,
              rotate: piece.team === "up" ? "180deg" : "0deg",
            }}
            src={`/12/${krName}.png`}
            alt="piece"
          />
        </div>
      )
    }
    return null
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
        message="이동할 수 없습니다"
      />
      <div
        style={{
          width: cellSize * 3 + "px",
          height: cellSize * 8 + "px",
        }}
      >
        {pieces.map((piece) => {
          return <Cell key={`${piece.key}`} piece={piece} />
        })}
        <Stack zIndex={10}>
          {new Array(8).fill(0).map((_, row) => {
            return new Array(3).fill(0).map((_, col) => {
              return (
                <div
                  key={`${row}-${col}`}
                  style={{
                    position: "absolute",
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    border: "1px solid black",
                    left: `${col * cellSize}px`,
                    top: `${row * cellSize}px`,
                  }}
                  onClick={() => handleCellClick(row, col)}
                ></div>
              )
            })
          })}
        </Stack>
      </div>
    </div>
  )
}

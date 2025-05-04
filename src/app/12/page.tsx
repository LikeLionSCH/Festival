"use client"

import { useEffect, useState } from "react"
import useLogic from "./useLogic"

type Position = {
  row: number
  col: number
}

const cellSize = 100 // 각 셀의 크기 (가로, 세로)

export default function Page() {
  const { board, predictAI, movePiece, turn } = useLogic()
  const [startPosition, setStartPosition] = useState<Position>({
    row: -1,
    col: -1,
  })

  useEffect(() => {
    console.log("턴:", turn)
    console.log("보드 상태:", JSON.stringify(board))
    if (board.length === 0) {
      return
    }
    if (turn === "up") {
      predictAI()
    }
  }, [turn, board])

  function getKrFromPid(pid: number): { name: string; color: string } | null {
    if (pid === 0) {
      return {
        name: "장",
        color: "red",
      }
    } else if (pid === 1) {
      return {
        name: "왕",
        color: "red",
      }
    } else if (pid === 2) {
      return {
        name: "상",
        color: "red",
      }
    } else if (pid === 3) {
      return {
        name: "자",
        color: "red",
      }
    } else if (pid === 4) {
      return {
        name: "후",
        color: "red",
      }
    } else if (pid === 5) {
      return {
        name: "자",
        color: "green",
      }
    } else if (pid === 6) {
      return {
        name: "상",
        color: "green",
      }
    } else if (pid === 7) {
      return {
        name: "왕",
        color: "green",
      }
    } else if (pid === 8) {
      return {
        name: "장",
        color: "green",
      }
    } else if (pid === 9) {
      return {
        name: "후",
        color: "green",
      }
    } else {
      return null
    }
  }

  function handleCellClick(row: number, col: number) {
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

  function getCell(row: number, col: number) {
    const cell = board[row][col]
    if (cell === -1) {
      return null
    }
    const piece = getKrFromPid(cell)
    if (piece) {
      return (
        <div
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            backgroundColor: piece.color,
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
              rotate: piece.color === "red" ? "180deg" : "0deg",
            }}
            src={`/12/${piece.name}.png`}
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
      }}
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, cellIndex) => (
            <div
              key={cell === -1 ? `${cellIndex}-${rowIndex}` : cell}
              onClick={() => handleCellClick(rowIndex, cellIndex)}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {getCell(rowIndex, cellIndex)}
              {startPosition.row === rowIndex &&
                startPosition.col === cellIndex && (
                  <div
                    style={{
                      position: "absolute",
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      backgroundColor: "rgba(255, 0, 0, 0.5)",
                      borderRadius: "50%",
                    }}
                  ></div>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

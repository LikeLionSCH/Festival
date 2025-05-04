"use client"

import { useEffect, useState } from "react"
import useLogic from "./useLogic"

type Position = {
  row: number
  col: number
}

export default function Page() {
  const { board, predictAI, movePiece, turn } = useLogic()
  const [startPosition, setStartPosition] = useState<Position>({
    row: -1,
    col: -1,
  })

  useEffect(() => {
    console.log("턴:", turn)
    if (turn === "up") {
      predictAI()
    }
  }, [turn])

  function getKrFromPid(pid: number) {
    if (pid === 0) {
      return "상하(상)"
    } else if (pid === 1) {
      return "왕(상)"
    } else if (pid === 2) {
      return "대각(상)"
    } else if (pid === 3) {
      return "앞(상)"
    } else if (pid === 4) {
      return "후(상)"
    } else if (pid === 5) {
      return "앞(하)"
    } else if (pid === 6) {
      return "대각(하)"
    } else if (pid === 7) {
      return "왕(하)"
    } else if (pid === 8) {
      return "상하(하)"
    } else if (pid === 9) {
      return "후(하)"
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

  return (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              onClick={() => handleCellClick(rowIndex, cellIndex)}
              style={{
                width: "50px",
                height: "50px",
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {getKrFromPid(board[rowIndex][cellIndex])}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

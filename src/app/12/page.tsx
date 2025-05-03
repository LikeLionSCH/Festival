"use client"

import useLogic from "./useLogic"

export default function Page() {
  const { board } = useLogic()

  function getKrFromPid(pid: number) {
    if (pid === 0) {
      return "장(싱)"
    } else if (pid === 1) {
      return "왕(상)"
    } else if (pid === 2) {
      return "상(상)"
    } else if (pid === 3) {
      return "자(상)"
    } else if (pid === 4) {
      return "후(상)"
    } else if (pid === 5) {
      return "자(하)"
    } else if (pid === 6) {
      return "상(하)"
    } else if (pid === 7) {
      return "왕(하)"
    } else if (pid === 8) {
      return "장(하)"
    } else if (pid === 9) {
      return "후(하)"
    } else {
      return null
    }
  }

  return (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
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

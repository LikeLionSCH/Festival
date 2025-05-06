"use client"

import { Piece } from "./useLogic"
import styles from "./page.module.css"

export const CellSize = 100 // 각 셀의 크기 (가로, 세로)

export default function Cell({ piece }: { piece: Piece }) {
  const { row, col, pieceId } = piece
  if (row === 0 || row === 1 || row === 6 || row === 7) {
    return <HandleCell key={piece.key} piece={piece} />
  }
  const krName = getKrFromPid(pieceId)
  return (
    <div
      key={piece.key}
      className={styles.cell}
      style={{
        position: "absolute",
        width: `${CellSize}px`,
        height: `${CellSize}px`,
        left: `${col * CellSize}px`,
        top: `${row * CellSize}px`,
      }}
    >
      <img
        style={{
          width: `${CellSize - 10}px`,
          height: `${CellSize - 10}px`,
          rotate: piece.team === "up" ? "180deg" : "0deg",
        }}
        src={`/12/${krName}.png`}
        alt="piece"
      />
    </div>
  )
}

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

function HandleCell({ piece }: { piece: Piece }) {
  const { col } = piece
  const krName = getKrFromPid(piece.pieceId)

  const row = piece.row <= 1 ? piece.row - 1 : piece.row + 1

  return (
    <div key={piece.key}>
      <div
        className={styles.cell}
        style={{
          position: "absolute",
          width: `${CellSize}px`,
          height: `${CellSize}px`,
          left: `${col * CellSize}px`,
          top: `${row * CellSize}px`,
        }}
      >
        <img
          style={{
            width: `${CellSize - 10}px`,
            height: `${CellSize - 10}px`,
            rotate: piece.team === "up" ? "180deg" : "0deg",
          }}
          src={`/12/${krName}.png`}
          alt="piece"
        />
      </div>
    </div>
  )
}

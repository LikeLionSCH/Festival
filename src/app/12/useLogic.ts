"use client"

import axios from "axios"
import { atom, useAtom } from "jotai"
import { useEffect, useState } from "react"

const boardAtom = atom<Array<Array<number>>>([])

function useLogic() {
  const [board, setBoard] = useAtom(boardAtom)
  const [turn, setTurn] = useState(0)

  useEffect(() => {
    resetBoard()
  }, [])

  // AI 예측 실행
  async function predictAI() {
    const boardData = new Array(10)
      .fill(0)
      .map(() => new Array(8).fill(0).map(() => new Array(3).fill(0)))

    //보드 데이터 주입
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 3; col++) {
        const value = board[row][col]
        // value가 -1인 경우 0으로 변환
        if (value === -1) {
          continue
        }
        boardData[value][row][col] = 1
      }
    }

    const { data } = await axios.post("http://192.168.0.100:8000/predict", {
      board: boardData,
      turn: turn,
    })

    const action = data.predicted_action

    const totalCells = 8 * 3
    const start_index = Math.floor(action / totalCells)

    const target_index = action % totalCells
    const start_row = Math.floor(start_index / 3)
    const start_col = start_index % 3
    const target_row = Math.floor(target_index / 3)
    const target_col = target_index % 3

    console.log(
      `출발: index = ${start_index}, row = ${start_row}, col = ${start_col}`
    )
    console.log(
      `도착: index = ${target_index}, row = ${target_row}, col = ${target_col}`
    )

    const newBoard = [...board]
    newBoard[target_row][target_col] = newBoard[start_row][start_col]
    newBoard[start_row][start_col] = -1
    setBoard(newBoard)
    setTurn(turn === 0 ? 1 : 0) // 턴 변경
  }

  function resetBoard() {
    const newBoard: Array<Array<number>> = new Array(8)
    for (let i = 0; i < 8; i++) {
      newBoard[i] = new Array(3).fill(-1)
    }
    newBoard[2][0] = 0 // 상단 장 배치
    newBoard[2][1] = 1 // 상단 왕 배치
    newBoard[2][2] = 2 // 상단 상 배치
    newBoard[3][1] = 3 // 상단 자 배치

    newBoard[4][1] = 5 // 하단 자 배치
    newBoard[5][0] = 6 // 하단 상 배치
    newBoard[5][1] = 7 // 하단 왕 배치
    newBoard[5][2] = 8 // 하단 장 배치

    setBoard(newBoard)
  }

  return { board, predictAI }
}

export default useLogic

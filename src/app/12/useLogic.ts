"use client"

import axios from "axios"
import { atom, useAtom } from "jotai"
import { useEffect, useState } from "react"

const boardAtom = atom<Array<Array<number>>>([])

function useLogic() {
  const [board, setBoard] = useAtom(boardAtom)
  const [turn, setTurn] = useState<"up" | "down">("down")
  const [arrivedUpPlayer, setArrivedUpPlayer] = useState(false)
  const [arrivedDownPlayer, setArrivedDownPlayer] = useState(false)

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
      turn: turn === "up" ? 0 : 1,
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
    movePiece(start_row, start_col, target_row, target_col) // AI의 예측 이동

    if (data.done) {
      alert("게임 종료 / " + data.reward)
      return
    }
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

  function movePiece(
    startRow: number,
    startCol: number,
    targetRow: number,
    targetCol: number
  ) {
    // 이동할 칸이 유효한지 확인
    if (!isValidMove(startRow, startCol, targetRow, targetCol)) {
      alert("Invalid move")
      return
    }

    const piece = board[startRow][startCol]
    let newBoard = [...board]
    // 이동할 칸에 기물 있는지 확인
    if (board[targetRow][targetCol] !== -1) {
      newBoard = catchPiece(board[targetRow][targetCol])
    }
    newBoard[targetRow][targetCol] = newBoard[startRow][startCol]
    if (newBoard[targetRow][targetCol] === 3 && targetRow === 5) {
      newBoard[targetRow][targetCol] = 4
    } else if (newBoard[targetRow][targetCol] === 5 && targetRow === 2) {
      newBoard[targetRow][targetCol] = 9
    }
    newBoard[startRow][startCol] = -1

    if (piece === 1) {
    }

    setBoard(newBoard)
    setTurn(turn === "up" ? "down" : "up") // 턴 변경
  }

  function catchPiece(targetPiece: number) {
    const newBoard = [...board]
    // 상단 기물 처리
    if (targetPiece === 0) {
      if (board[6][2] !== -1) {
        newBoard[7][2] = 8
      } else {
        newBoard[6][2] = 8
      }
    }
    if (targetPiece === 2) {
      if (board[6][1] !== -1) {
        newBoard[7][1] = 6
      } else {
        newBoard[6][1] = 6
      }
    }
    if (targetPiece === 3) {
      if (board[6][0] !== -1) {
        newBoard[7][0] = 5
      } else {
        newBoard[6][0] = 5
      }
    }
    if (targetPiece === 4) {
      if (board[6][0] !== -1) {
        newBoard[7][0] = 5
      } else {
        newBoard[6][0] = 5
      }
    }

    // 하단 기물 처리
    if (targetPiece === 5) {
      if (board[1][2] !== -1) {
        newBoard[0][2] = 3
      } else {
        newBoard[1][2] = 3
      }
    }
    if (targetPiece === 6) {
      if (board[1][1] !== -1) {
        newBoard[0][1] = 0
      } else {
        newBoard[1][1] = 0
      }
    }
    if (targetPiece === 8) {
      if (board[1][0] !== -1) {
        newBoard[0][0] = 2
      } else {
        newBoard[1][0] = 2
      }
    }
    if (targetPiece === 9) {
      if (board[1][2] !== -1) {
        newBoard[0][2] = 3
      } else {
        newBoard[1][2] = 3
      }
    }

    return newBoard
  }
  //갈 수 있는 칸인지 확인
  function isValidMove(
    startRow: number,
    startCol: number,
    targetRow: number,
    targetCol: number
  ) {
    const piece = board[startRow][startCol]
    const targetPiece = board[targetRow][targetCol]
    // 윗사람이 자신의 말이 있는 곳으로 이동 불가
    if (piece <= 4 && targetPiece <= 4 && targetPiece !== -1) {
      return false
    }
    if (piece >= 5 && targetPiece >= 5) {
      return false
    }
    // 이동할 칸이 보드 범위를 벗어나는지 확인
    if (startRow >= 2 && startRow <= 5) {
      if (targetRow < 2 || targetRow > 5) {
        return false
      }
    }

    if (startRow < 2) {
      if (turn === "down") {
        return false
      }
      return targetRow < 5
    }
    if (startRow > 5) {
      if (turn === "up") {
        return false
      }
      return targetRow > 2
    }

    const rowDiff = Math.abs(targetRow - startRow)
    const colDiff = Math.abs(targetCol - startCol)

    // 상하좌우 기물 이동
    if (piece === 0 || piece === 8) {
      if (rowDiff > 0 && colDiff === 0) {
        return true
      }
      if (colDiff > 0 && rowDiff === 0) {
        return true
      }
      return false
    }
    // 대각선 기물 이동
    if (piece === 2 || piece === 6) {
      if (rowDiff === 1 && colDiff === 1) {
        return true
      }
      return false
    }
    // 왕 기물 이동
    if (piece === 1 || piece === 7) {
      if (rowDiff <= 1 && colDiff <= 1) {
        return true
      }
      return false
    }
    // 자 기물 이동
    if (piece === 3) {
      return rowDiff === 1 && startRow < targetRow
    }
    if (piece === 5) {
      return rowDiff === 1 && startRow > targetRow
    }
    // 후 기물 이동
    if (piece === 4) {
      if (rowDiff === 1 && colDiff === 0) {
        return true
      }
      if (colDiff === 1 && rowDiff === 0) {
        return true
      }
      if (rowDiff === 1 && colDiff === 1) {
        return startRow < targetRow
      }
      return false
    }
    if (piece === 9) {
      if (rowDiff === 1 && colDiff === 0) {
        return true
      }
      if (colDiff === 1 && rowDiff === 0) {
        return true
      }
      if (rowDiff === 1 && colDiff === 1) {
        return startRow > targetRow
      }
      return false
    }
    return true
  }

  return { board, predictAI, movePiece, turn }
}

export default useLogic

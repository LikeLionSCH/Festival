"use client"

import { atom, useAtom } from "jotai"
import { useEffect } from "react"

const boardAtom = atom<Array<Array<number>>>([])

function useLogic() {
  const [board, setBoard] = useAtom(boardAtom)

  useEffect(() => {
    resetBoard()
  }, [])

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

    console.log("newBoard", newBoard)
    setBoard(newBoard)
  }

  return { board }
}

export default useLogic

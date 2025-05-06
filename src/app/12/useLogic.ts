"use client"

import axios from "axios"
import { useEffect } from "react"
import { atom, useAtom } from "jotai"

export type Piece = {
  row: number
  col: number
  pieceId: PieceId
  team: "up" | "down"
  key: string
}

enum PieceId {
  UP_GIRAFFE = 0,
  UP_LION = 1,
  UP_ELEPHANT = 2,
  UP_CHICK = 3,
  UP_CHICKEN = 4,
  DOWN_CHICK = 5,
  DOWN_ELEPHANT = 6,
  DOWN_LION = 7,
  DOWN_GIRAFFE = 8,
  DOWN_CHICKEN = 9,
}

const IsEmpty = -1

const piecesAtom = atom<Piece[]>([])
const turnAtom = atom<"up" | "down">("down")
const isCanMoveAtom = atom(false)
const user = atom<"up" | "down">("down")
const whoWinAtom = atom<false | "up" | "down">(false)
const arrivedUpUserAtom = atom(false)
const arrivedDownUserAtom = atom(false)

function useLogic() {
  const [pieces, setPieces] = useAtom(piecesAtom)
  const [turn, setTurn] = useAtom(turnAtom)
  const [isCanMove, setIsCanMove] = useAtom(isCanMoveAtom)
  const [userTeam, setUserTeam] = useAtom(user)
  const [whoWin, setWhoWin] = useAtom(whoWinAtom)
  const [arrivedUpUser, setArrivedUpUser] = useAtom(arrivedUpUserAtom)
  const [arrivedDownUser, setArrivedDownUser] = useAtom(arrivedDownUserAtom)

  useEffect(() => {
    resetBoard()
  }, [])

  function createPiece(
    row: number,
    col: number,
    pieceId: number,
    team: "up" | "down"
  ) {
    const newPiece: Piece = {
      row,
      col,
      pieceId,
      team,
      key: Math.random().toString(36),
    }
    return newPiece
  }

  // AI 예측 실행
  async function predictAI() {
    await new Promise((resolve) => setTimeout(resolve, 500)) // 1초 대기
    const boardData = new Array(10)
      .fill(0)
      .map(() => new Array(8).fill(0).map(() => new Array(3).fill(0)))

    pieces.forEach((piece) => {
      const { row, col, pieceId: pieceId } = piece
      boardData[pieceId][row][col] = 1
    })

    const { data } = await axios.post("http://home.iubns.net:8000/predict", {
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

    movePiece(start_row, start_col, target_row, target_col) // AI의 예측 이동
  }

  function resetBoard() {
    const pieces: Array<Piece> = []
    // 상단 장 배치
    pieces.push(createPiece(2, 0, PieceId.UP_GIRAFFE, "up"))
    // 상단 왕 배치
    pieces.push(createPiece(2, 1, PieceId.UP_LION, "up"))
    // 상단 상 배치
    pieces.push(createPiece(2, 2, PieceId.UP_ELEPHANT, "up"))
    // 상단 자 배치
    pieces.push(createPiece(3, 1, PieceId.UP_CHICK, "up"))

    // 하단 자 배치
    pieces.push(createPiece(4, 1, PieceId.DOWN_CHICK, "down"))
    // 하단 상 배치
    pieces.push(createPiece(5, 0, PieceId.DOWN_ELEPHANT, "down"))
    // 하단 왕 배치
    pieces.push(createPiece(5, 1, PieceId.DOWN_LION, "down"))
    // 하단 장 배치
    pieces.push(createPiece(5, 2, PieceId.DOWN_GIRAFFE, "down"))

    setPieces(pieces)
    setTurn("down")
    setWhoWin(false)
  }

  function movePiece(
    startRow: number,
    startCol: number,
    targetRow: number,
    targetCol: number
  ) {
    // 이동할 칸이 유효한지 확인
    if (!isValidMove(startRow, startCol, targetRow, targetCol)) {
      setIsCanMove(true)
      return
    }

    const targetPieceId = getPieceIdFromPosition(targetRow, targetCol)
    // 이동할 칸에 기물 있는지 확인
    if (targetPieceId !== IsEmpty) {
      const targetPiece = pieces.find(
        (piece) => piece.row === targetRow && piece.col === targetCol
      )
      if (targetPiece) {
        catchPiece(targetPiece)
      }
    }
    const piece = getPieceFromPosition(startRow, startCol)

    if (!piece) {
      return
    }
    piece.row = targetRow
    piece.col = targetCol

    if (piece.pieceId === 3 && targetRow === 5) {
      piece.pieceId = 4
    } else if (piece.pieceId === 5 && targetRow === 2) {
      piece.pieceId = 9
    }

    // 싱대 진영에 왕이 들어갔다면
    const upLine = pieces.find((piece) => piece.pieceId === PieceId.UP_LION)
    if (upLine && upLine.row === 5) {
      if (arrivedUpUser) {
        setTimeout(() => {
          setWhoWin("up")
        }, 1000)
      } else {
        setArrivedUpUser(true)
      }
    } else {
      setArrivedUpUser(false)
    }
    const downLine = pieces.find((piece) => piece.pieceId === PieceId.DOWN_LION)
    if (downLine && downLine.row === 2) {
      if (arrivedDownUser) {
        setTimeout(() => {
          setWhoWin("down")
        }, 1000)
      } else {
        setArrivedDownUser(true)
      }
    } else {
      setArrivedDownUser(false)
    }

    setPieces((prevPieces) => {
      const newPieces = [...prevPieces]
      return newPieces
    })
    setTurn(turn === "up" ? "down" : "up") // 턴 변경
  }

  function getPieceFromPosition(row: number, col: number) {
    const piece = pieces.find((piece) => piece.row === row && piece.col === col)
    if (piece) {
      return piece
    }
    return null
  }

  function getPieceIdFromPosition(row: number, col: number) {
    const piece = pieces.find((piece) => piece.row === row && piece.col === col)
    if (piece) {
      return piece.pieceId
    }
    return -1
  }

  function pushPiece(piece: Piece) {
    setPieces((prevPieces) => {
      const newPieces = [...prevPieces]
      newPieces.push(piece)
      return newPieces
    })
  }

  function removePiece(piece: Piece) {
    setPieces((prevPieces) => {
      const newPieces = prevPieces.filter((p) => p.key !== piece.key)
      return newPieces
    })
  }

  function catchPiece(targetPiece: Piece) {
    switch (targetPiece.pieceId) {
      case 0:
        if (getPieceIdFromPosition(6, 2) !== IsEmpty) {
          const newPiece = createPiece(7, 2, 8, "down")
          pushPiece(newPiece)
        } else {
          const newPiece = createPiece(6, 2, 8, "down")
          pushPiece(newPiece)
        }
        break
      case 1:
        setTimeout(() => {
          setWhoWin("down")
        }, 1000)
        break
      case 2:
        if (getPieceIdFromPosition(6, 1) !== IsEmpty) {
          const newPiece = createPiece(7, 1, 6, "down")
          pushPiece(newPiece)
        } else {
          const newPiece = createPiece(6, 1, 6, "down")
          pushPiece(newPiece)
        }
        break
      case 3:
        if (getPieceIdFromPosition(6, 0) !== IsEmpty) {
          const newPiece = createPiece(7, 0, 5, "down")
          pushPiece(newPiece)
        } else {
          const newPiece = createPiece(6, 0, 5, "down")
          pushPiece(newPiece)
        }
        break
      case 4:
        if (getPieceIdFromPosition(6, 0) !== IsEmpty) {
          const newPiece = createPiece(7, 0, 5, "down")
          pushPiece(newPiece)
        } else {
          const newPiece = createPiece(6, 0, 5, "down")
          pushPiece(newPiece)
        }
        break
      case 5:
        if (getPieceIdFromPosition(1, 2) !== IsEmpty) {
          const newPiece = createPiece(0, 2, 3, "up")
          pushPiece(newPiece)
        } else {
          const newPiece = createPiece(1, 2, 3, "up")
          pushPiece(newPiece)
        }
        break
      case 6:
        if (getPieceIdFromPosition(1, 1) !== IsEmpty) {
          const newPiece = createPiece(0, 1, 0, "up")
          pushPiece(newPiece)
        } else {
          const newPiece = createPiece(1, 1, 0, "up")
          pushPiece(newPiece)
        }
        break
      case 7:
        setTimeout(() => {
          setWhoWin("up")
        }, 1000)
        break
      case 8:
        if (getPieceIdFromPosition(1, 0) !== IsEmpty) {
          const newPiece = createPiece(0, 0, 2, "up")
          pushPiece(newPiece)
        } else {
          const newPiece = createPiece(1, 0, 2, "up")
          pushPiece(newPiece)
        }
        break
      case 9:
        if (getPieceIdFromPosition(1, 2) !== IsEmpty) {
          const newPiece = createPiece(0, 2, 3, "up")
          pushPiece(newPiece)
        } else {
          const newPiece = createPiece(1, 2, 3, "up")
          pushPiece(newPiece)
        }
        break
      default:
        break
    }

    if (targetPiece) {
      removePiece(targetPiece)
    }
  }

  //갈 수 있는 칸인지 확인
  function isValidMove(
    startRow: number,
    startCol: number,
    targetRow: number,
    targetCol: number
  ) {
    const piece = getPieceIdFromPosition(startRow, startCol)
    const targetPiece = getPieceIdFromPosition(targetRow, targetCol)
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
      if (rowDiff == 1 && colDiff === 0) {
        return true
      }
      if (colDiff == 1 && rowDiff === 0) {
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

  return {
    pieces,
    predictAI,
    movePiece,
    turn,
    isCanMove,
    setIsCanMove,
    getPieceFromPosition,
    userTeam,
    setUserTeam,
    resetBoard,
    whoWin,
  }
}

export default useLogic

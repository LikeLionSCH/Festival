"use client"

import { atom, useAtom } from "jotai"
import { useEffect } from "react"
import onnx from "onnxruntime-web"

const boardAtom = atom<Array<Array<number>>>([])

let session: onnx.InferenceSession | null = null

function useLogic() {
  const [board, setBoard] = useAtom(boardAtom)

  useEffect(() => {
    resetBoard()
    loadModel()
    //predictAI(new onnx.Tensor("float32", new Float32Array(8 * 3), [1, 8, 3]))
  }, [])

  async function loadModel() {
    session = await onnx.InferenceSession.create("./models/new2_1.onnx")

    // 2. 입력 데이터 준비
    // "board" 입력: [1, 10, 8, 3]
    const boardShape = [1, 10, 8, 3]
    const boardElementCount = boardShape.reduce((a, b) => a * b, 1)
    // 예시: board 데이터를 모두 0.5로 채움 (실제 환경에서는 게임 상태를 flatten하여 배열로 만듭니다)
    const boardData = new Float32Array(boardElementCount)
    boardData.fill(0.5) // 게임 보드 상태에 따라 값을 채워 줍니다.

    // "turn" 입력: [1]
    const turnShape = [1]
    // onnxruntime-web의 경우 int32를 사용하는 것이 안전하므로, turn 데이터를 int32로 생성합니다.
    const turnData = new BigInt64Array(1)
    turnData[0] = BigInt(0) // 예: 플레이어 0의 차례. 실제 상황에 맞게 값 설정.

    // 3. ONNX Tensor 생성: 입력 이름은 ONNX 모델 내에 정의된 이름("board", "turn")과 일치해야 합니다.
    const boardTensor = new onnx.Tensor("float32", boardData, boardShape)
    const turnTensor = new onnx.Tensor("int64", turnData, turnShape)

    // 4. 입력 딕셔너리 구성
    const feeds = {
      board: boardTensor,
      turn: turnTensor,
    }

    // 5. 추론 실행: session.run은 Promise를 반환합니다.
    const results = await session.run(feeds)

    // 결과 확인: ONNX 추론의 출력 이름은 ONNX 변환 시 지정한 output_names (예, "action")
    if (results.action) {
      console.log("추론 결과 (action):", results.action.data)

      const action = Number(results.action.data[0]) // 첫 번째 예측 결과를 가져옵니다.
      // action 값이 202라고 가정합니다.

      // 보드는 8행×3열이므로 전체 칸의 수는 8 * 3 = 24입니다.
      const totalCells = 8 * 3 // 즉, 24

      // 1. 출발 위치(flatten index)를 계산합니다.
      //    Python의 "action // (8 * 3)"는 JS에서 Math.floor(action / totalCells)로 표현합니다.
      const start_index = Math.floor(action / totalCells)

      // 2. 도착 위치(flatten index)를 계산합니다.
      //    Python의 "action % (8 * 3)"와 동일합니다.
      const target_index = action % totalCells

      // 3. 출발 좌표 (행, 열)를 계산합니다.
      //    Python의 "divmod(start_index, 3)"는 JS에서는
      //    행 : Math.floor(start_index / 3)
      //    열 : start_index % 3
      const start_row = Math.floor(start_index / 3)
      const start_col = start_index % 3

      // 4. 도착 좌표 (행, 열)를 계산합니다.
      //    Python의 "divmod(target_index, 3)"와 동일합니다.
      const target_row = Math.floor(target_index / 3)
      const target_col = target_index % 3

      // 결과 출력
      console.log(`Action: ${action}`)
      console.log(
        `출발: index = ${start_index}  -> 행: ${start_row}, 열: ${start_col}`
      )
      console.log(
        `도착: index = ${target_index}  -> 행: ${target_row}, 열: ${target_col}`
      )
    } else {
      console.log("추론 결과:", results)
    }
  }

  // AI 예측 실행
  async function predictAI(inputTensor) {
    const feeds = { input: inputTensor }

    const results = await session.run(feeds)
    return results.output.data
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

  return { board }
}

export default useLogic

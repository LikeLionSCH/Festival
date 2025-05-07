"use client"

import { useRouter } from "next/navigation"
import styles from "./page.module.css"
import { Button, Stack } from "@mui/material"

export default function Home() {
  const { push } = useRouter()
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>멋쟁이사자처럼</h1>
        <div style={{ height: "40px" }} />
        <p className={styles.description}>아래애서 게임을 선택해주세요</p>
        <Stack gap="24px">
          <Button onClick={() => push("/12")} variant="outlined">
            십이장기
          </Button>
          <Button
            onClick={() => push("https://ul88.github.io/appTossGameWeb.html")}
            variant="outlined"
          >
            한글 게임
          </Button>
          <Button onClick={() => push("/fitCircle")} variant="outlined">
            원 맞추기
          </Button>
          <Button onClick={() => push("/drawCircle")} variant="outlined">
            원 그리기
          </Button>
        </Stack>
      </div>
    </div>
  )
}

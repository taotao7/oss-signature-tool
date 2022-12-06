import React from 'react'
import {historyType} from "../../StandardSignature";

interface SignatureHistoryType {
  history: historyType[]
}

export default (props: SignatureHistoryType) => {
  const {history} = props
  return (
    <>
      <h1>签名记录</h1>

      <h1>{history.toString()}</h1>
    </>
  )
}

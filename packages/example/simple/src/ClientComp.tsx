'use client'

import { Button } from '@mui/material'
import { useState } from 'react'

export function ClientComp() {
  const [state, setState] = useState(0)
  return (
    <Button onClick={() => setState((prev) => prev + 1)}>Click {state}</Button>
  )
}

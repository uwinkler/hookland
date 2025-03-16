import { Box } from '@mui/material'
import React from 'react'

export function Layout({ children }: React.PropsWithChildren<unknown>) {
  return (
    <Box
      sx={{
        display: 'grid',
        placeContent: 'center',
        height: '100vh',
      }}
    >
      {children}
    </Box>
  )
}

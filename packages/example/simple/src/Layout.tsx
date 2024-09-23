import { Box, CssBaseline } from '@mui/material'
import React from 'react'

export function Layout({ children }: React.PropsWithChildren<unknown>) {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'grid',
          placeContent: 'center',
          height: '100%',
          width: '100%'
        }}
      >
        {children}
      </Box>
    </>
  )
}

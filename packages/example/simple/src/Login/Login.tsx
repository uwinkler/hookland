import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import { useAppState } from '../useAppState'

export function Login() {
  const { appState } = useAppState()
  const state = appState.state

  return (
    <>
      {state === 'login' && <LoginForm />}
      {state === 'loading' && <Loading />}
      {state === 'error' && <LoginError />}
    </>
  )
}

const SIZE = { minWidth: 450, minHeight: 420 }

function Loading() {
  return (
    <Paper
      elevation={3}
      sx={{ ...SIZE, display: 'grid', placeContent: 'center' }}
    >
      <CircularProgress />
    </Paper>
  )
}

function LoginForm() {
  const { login } = useAppState()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login({ userName: username, password })
  }

  return (
    <Paper elevation={3} sx={SIZE}>
      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h1>Lucky Dice</h1>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username (try Klaus)"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password (try 1234)"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log in
            </Button>
          </Box>
        </Box>
      </Container>
    </Paper>
  )
}

function LoginError() {
  const { appState, setAppState } = useAppState()

  const onTryAgain = () => {
    setAppState({
      ...appState,
      state: 'login'
    })
  }

  return (
    <Paper sx={{ ...SIZE, display: 'flex' }} elevation={3}>
      <Container
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <h1>Sorry</h1>

        <Typography>Sorry... Wrong password or username</Typography>
        <Button
          onClick={onTryAgain}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Try again...
        </Button>
      </Container>
    </Paper>
  )
}

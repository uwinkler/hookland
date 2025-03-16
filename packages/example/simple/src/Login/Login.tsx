import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import { useAuthState } from '../useAuthState'
import { Layout } from '../Layout'

export function Login() {
  const { authState } = useAuthState()

  return (
    <Layout>
      {authState.state === 'no-user' && <LoginForm />}
      {authState.state === 'loading' && <Loading />}
      {authState.state === 'error' && <LoginError />}
    </Layout>
  )
}

const SIZE = { minWidth: 450, minHeight: 420 }

function Loading() {
  return (
    <Paper
      elevation={3}
      sx={{
        ...SIZE,
        display: 'grid',
        //  placeContent: 'center'
      }}
    >
      <CircularProgress />
    </Paper>
  )
}

function LoginForm() {
  const { login } = useAuthState()
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
  const { logout } = useAuthState()

  const onTryAgain = () => logout()

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

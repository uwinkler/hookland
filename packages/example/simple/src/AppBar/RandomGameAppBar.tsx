import AccountCircleIcon from '@mui/icons-material/Settings'
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { useAuthState } from '../useAuthState'
import { useNavigate } from 'react-router'

export function RandomGameAppBar() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isMenuOpen = Boolean(anchorEl)
  const { authState, logout } = useAuthState()
  const navigate = useNavigate()

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar sx={{ backgroundColor: 'white', color: 'primary.main' }}>
      <Toolbar>

        <Avatar alt={authState.user || ''} sx={{ mr: 2 }} src={`https://robohash.org/${authState.user}.png`}
        ></Avatar>
        <Typography variant="h6" sx={{ flexGrow: 0 }}>
          {authState.user}
        </Typography>

        {/* Center: Balance */}
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <h1>Random Game</h1>
        </Box>

        {/* Right: Menu */}
        <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
          <AccountCircleIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
          <MenuItem href="/settings">Settings</MenuItem>
          <MenuItem onClick={() => navigate("/top-up")}>Top up money</MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

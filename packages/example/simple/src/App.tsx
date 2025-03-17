import { Route, Routes } from 'react-router'
import { Login } from './Login/Login'
import ProtectedRoute from './Login/ProtectedRoute'
import { RandomGame } from './RandomGame/RandomGame'
import { TopUp } from './TopUp/TopUp'
import { RandomGameAlwaysWinPebble } from './RandomGame/__tests__/RandomGameAlwaysWin.pebble'

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute />} >
      <Route path="game" element={<RandomGame />} />
      <Route path="top-up" element={<TopUp />} />
    </Route>
    <Route path="/pebble" >
      <Route path="random-game-always-win" element={<RandomGameAlwaysWinPebble />} />
    </Route>
  </Routes>
}


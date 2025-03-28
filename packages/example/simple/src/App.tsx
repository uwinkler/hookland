import { Route, Routes } from 'react-router'
import { Login } from './Login/Login'
import ProtectedRoute from './Login/ProtectedRoute'
import { Pebbles } from './PebblesComp'
import { RandomGame } from './RandomGame/RandomGame'
import { TopUp } from './TopUp/TopUp'

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute />} >
      <Route path="game" element={<RandomGame />} />
      <Route path="top-up" element={<TopUp />} />
    </Route>
    <Route path="/pebble" element={<Pebbles />} >
      <Route path=":id" element={<Pebbles />} />
    </Route>
  </Routes>
}


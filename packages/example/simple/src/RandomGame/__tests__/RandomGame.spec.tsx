/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { RandomGameAlwaysWinPebble } from './RandomGameAlwaysWin.pebble'
import { MemoryRouter } from 'react-router'


test('RandomGame win', async () => {
  render(<RandomGameAlwaysWinPebble />, { wrapper: MemoryRouter })
  await screen.findByText('You win 100,- EUR! 🥳🎉')
})

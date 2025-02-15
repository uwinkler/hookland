import { expect, test } from 'vitest'
import { mergeMap } from '../merge-map'

test('merge map - 2 empty maps', () => {
  const m1 = new Map()
  const m2 = new Map()
  const res = mergeMap(m1, m2)
  expect(res).toEqual(new Map())
})

test('merge map - 1 empty map', () => {
  const m1 = new Map()
  const m2 = new Map()
  m2.set(1, 1)
  const res = mergeMap(m1, m2)
  expect(res).toEqual(m2)
})

test('merge map - 1 empty map', () => {
  const m1 = new Map()
  const m2 = new Map()
  m1.set(1, 1)
  const res = mergeMap(m1, m2)
  expect(res).toEqual(m1)
})

test('merge map - identical maps', () => {
  const m1 = new Map()
  const m2 = new Map()
  m1.set(1, 1)
  m2.set(1, 1)
  const res = mergeMap(m1, m2)
  expect(res).toEqual(m1)
})

test('merge map - identical maps', () => {
  const m1 = new Map()
  const m2 = new Map()
  const m3 = new Map()
  m1.set(1, 1)
  m2.set(2, 2)
  m3.set(3, 3)
  const res = mergeMap(mergeMap(m1, m2), m3)
  expect(res).toEqual(
    new Map([
      [1, 1],
      [2, 2],
      [3, 3]
    ])
  )
})

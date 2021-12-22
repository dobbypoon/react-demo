import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

test('renders welcome', () => {
  render(<App />)
  const welcome = screen.getByText(/Welcome, edit me/i)
  expect(welcome).toBeInTheDocument()
})

test('counter', async () => {
  render(<App />)
  expect(screen.getByText('Welcome, edit me! 0')).toBeInTheDocument()
  expect(await screen.findByText('Welcome, edit me! 1')).toBeInTheDocument()
})

test('form submit and reset', () => {
  render(<App />)

  expect(screen.getByText('a: who are you?')).toBeInTheDocument()
  expect(screen.getByText('b: who are you?')).toBeInTheDocument()

  fireEvent.change(screen.getByLabelText('Name:'), {
    target: { value: 'SpiderMan' },
  })
  userEvent.click(screen.getByText('submit'))

  expect(screen.getByText('a: Hello, SpiderMan')).toBeInTheDocument()
  expect(screen.getByText('b: Hello, SpiderMan')).toBeInTheDocument()

  userEvent.click(screen.getByText('reset'))

  expect(screen.getByText('a: who are you?')).toBeInTheDocument()
  expect(screen.getByText('b: who are you?')).toBeInTheDocument()
})

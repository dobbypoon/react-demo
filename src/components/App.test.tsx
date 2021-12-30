import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

test('add todo item', () => {
  render(<App />)

  userEvent.type(
    screen.getByPlaceholderText('What needs to be done?'),
    '  {enter}',
  )
  userEvent.type(
    screen.getByPlaceholderText('What needs to be done?'),
    'new todo item 1{enter}',
  )
  userEvent.type(
    screen.getByPlaceholderText('What needs to be done?'),
    'new todo item 2{enter}',
  )

  let updatedTodoList = JSON.parse(localStorage.getItem('TODO_LIST') || '""')
  expect(updatedTodoList).toStrictEqual([
    { id: 1, completed: false, description: 'new todo item 1' },
    { id: 2, completed: false, description: 'new todo item 2' },
  ])
})

test('edit todo item', () => {
  const todoList = [
    { id: 1, completed: false, description: 'unmodified todo item 1' },
    { id: 2, completed: false, description: 'unmodified todo item 2' },
  ]
  localStorage.setItem('TODO_LIST', JSON.stringify(todoList))
  render(<App />)

  userEvent.dblClick(screen.getByText('unmodified todo item 1'))
  const input = screen.getByDisplayValue(
    'unmodified todo item 1',
  ) as HTMLInputElement
  input.setSelectionRange(0, 2)
  userEvent.type(input, '{backspace}{enter}')

  let updatedTodoList = JSON.parse(localStorage.getItem('TODO_LIST') || '""')
  expect(updatedTodoList).toStrictEqual([
    { id: 1, completed: false, description: 'modified todo item 1' },
    { id: 2, completed: false, description: 'unmodified todo item 2' },
  ])
})

test('change active view', () => {
  const todoList = [
    { id: 1, completed: false, description: 'active todo item' },
    { id: 2, completed: true, description: 'completed todo item' },
  ]
  localStorage.setItem('TODO_LIST', JSON.stringify(todoList))
  render(<App />)

  userEvent.click(screen.getByText('Active'))
  expect(screen.queryByText('active todo item')).toBeInTheDocument()
  expect(screen.queryByText('completed todo item')).not.toBeInTheDocument()

  userEvent.click(screen.getByText('Completed'))
  expect(screen.queryByText('active todo item')).not.toBeInTheDocument()
  expect(screen.queryByText('completed todo item')).toBeInTheDocument()

  userEvent.click(screen.getByText('All'))
  expect(screen.queryByText('active todo item')).toBeInTheDocument()
  expect(screen.queryByText('completed todo item')).toBeInTheDocument()
})

test('toggle single item', () => {
  const todoList = [
    { id: 1, completed: false, description: 'incomplete todo item' },
  ]
  localStorage.setItem('TODO_LIST', JSON.stringify(todoList))
  render(<App />)

  let updatedTodoList
  userEvent.click(screen.getByTestId('single-item-toggle'))
  updatedTodoList = JSON.parse(localStorage.getItem('TODO_LIST') || '""')
  expect(updatedTodoList).toStrictEqual([
    { id: 1, completed: true, description: 'incomplete todo item' },
  ])

  userEvent.click(screen.getByTestId('single-item-toggle'))
  updatedTodoList = JSON.parse(localStorage.getItem('TODO_LIST') || '""')
  expect(updatedTodoList).toStrictEqual([
    { id: 1, completed: false, description: 'incomplete todo item' },
  ])
})

test('toggle all', () => {
  const todoList = [
    { id: 1, completed: false, description: 'incomplete todo item 1' },
    { id: 2, completed: true, description: 'incomplete todo item 2' },
  ]
  localStorage.setItem('TODO_LIST', JSON.stringify(todoList))
  render(<App />)

  let updatedTodoList
  userEvent.click(screen.getByTestId('toggle-all-checkbox'))
  updatedTodoList = JSON.parse(localStorage.getItem('TODO_LIST') || '""')
  expect(updatedTodoList).toStrictEqual([
    { id: 1, completed: true, description: 'incomplete todo item 1' },
    { id: 2, completed: true, description: 'incomplete todo item 2' },
  ])

  userEvent.click(screen.getByTestId('toggle-all-checkbox'))
  updatedTodoList = JSON.parse(localStorage.getItem('TODO_LIST') || '""')
  expect(updatedTodoList).toStrictEqual([
    { id: 1, completed: false, description: 'incomplete todo item 1' },
    { id: 2, completed: false, description: 'incomplete todo item 2' },
  ])

  userEvent.click(screen.getByTestId('toggle-all-checkbox'))
  updatedTodoList = JSON.parse(localStorage.getItem('TODO_LIST') || '""')
  expect(updatedTodoList).toStrictEqual([
    { id: 1, completed: true, description: 'incomplete todo item 1' },
    { id: 2, completed: true, description: 'incomplete todo item 2' },
  ])
})

test('delete single item', () => {
  const todoList = [{ id: 1, completed: false, description: 'todo item' }]
  localStorage.setItem('TODO_LIST', JSON.stringify(todoList))
  render(<App />)

  let updatedTodoList
  userEvent.click(screen.getByTestId('delete-button'))
  updatedTodoList = JSON.parse(localStorage.getItem('TODO_LIST') || '""')
  expect(updatedTodoList).toStrictEqual([])
})

test('clear completed', () => {
  const todoList = [
    { id: 1, completed: false, description: 'incomplete todo item' },
    { id: 2, completed: true, description: 'completed todo item' },
  ]
  localStorage.setItem('TODO_LIST', JSON.stringify(todoList))
  render(<App />)

  userEvent.click(screen.getByText('Clear completed'))
  let updatedTodoList = JSON.parse(localStorage.getItem('TODO_LIST') || '""')
  expect(updatedTodoList).toStrictEqual([
    { id: 1, completed: false, description: 'incomplete todo item' },
  ])
})

import React, { MutableRefObject, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import useLocalStorage from '../hooks/useLocalStorage'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 40px;
`

const TodosWrapper = styled.div``

enum ActiveViewType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

type TTodoItem = {
  id: number
  completed: boolean
  description: string
}

type TActiveView = ActiveViewType

type TTodoItemProps = {
  item: TTodoItem
  updateTodoItem: (item: TTodoItem, isDelete?: boolean) => void
}

function TodoItem({ item, updateTodoItem }: TTodoItemProps): JSX.Element {
  const todoEditInputEl = useRef() as MutableRefObject<HTMLInputElement>
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleToggleCompleted = () => {
    updateTodoItem({ ...item, completed: !item.completed })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateTodoItem({
        ...item,
        description: todoEditInputEl.current.value.trim(),
      })
      setIsEditing(false)
    }
  }

  const handleDeleteItem = () => {
    updateTodoItem(item, true)
  }

  return (
    <div>
      <input
        type="checkbox"
        onChange={handleToggleCompleted}
        checked={item.completed}
      />
      <span onDoubleClick={handleEdit}>{item.description}</span>
      {isEditing && (
        <input
          type="text"
          ref={todoEditInputEl}
          defaultValue={item.description}
          onKeyDown={handleKeyDown}
        />
      )}
      <button type="button" onClick={handleDeleteItem}>
        X
      </button>
    </div>
  )
}

function App(): JSX.Element {
  const todoInputEl = useRef() as MutableRefObject<HTMLInputElement>

  const [todoList, setTodoList] = useLocalStorage<TTodoItem[]>('TODO_LIST', [])
  const [activeView, setActiveView] = useState<TActiveView>(ActiveViewType.ALL)
  const todoListDisplay = useMemo(() => {
    switch (activeView) {
      case ActiveViewType.ACTIVE:
        return todoList.filter(({ completed }) => completed === false)

      case ActiveViewType.COMPLETED:
        return todoList.filter(({ completed }) => completed === true)

      default:
        return todoList
    }
  }, [todoList, activeView])

  const getTodoListNewId = (): number => {
    return todoList.length > 0 ? todoList[todoList.length - 1].id + 1 : 1
  }

  const handleToggleAll = () => {
    const untickCompleted = todoList.every(
      ({ completed }) => completed === true,
    )
    const updatedTodoList = todoList.map((todoItem) => {
      return { ...todoItem, completed: !untickCompleted }
    })
    setTodoList(updatedTodoList)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTodoItem(todoInputEl.current.value.trim())
      todoInputEl.current.value = ''
    }
  }

  const handleClearCompleted = () => {
    setTodoList(todoList.filter(({ completed }) => completed === false))
  }

  const addTodoItem = (itemDescription: string) => {
    if (itemDescription === '') {
      return
    }
    const todoItem: TTodoItem = {
      id: getTodoListNewId(),
      completed: false,
      description: itemDescription,
    }
    setTodoList([...todoList, todoItem])
  }

  const updateTodoItem = (updateItem: TTodoItem, isDelete?: boolean) => {
    let updatedTodoList: TTodoItem[]
    if (isDelete) {
      updatedTodoList = todoList.filter(
        (todoItem) => todoItem.id !== updateItem.id,
      )
    } else {
      updatedTodoList = todoList.map((todoItem) => {
        if (todoItem.id === updateItem.id) {
          return updateItem
        }
        return todoItem
      })
    }
    setTodoList(updatedTodoList)
  }

  return (
    <Container>
      <TodosWrapper>
        <div>
          <h1>todos</h1>
          <div>
            {/* if all completed -> active */}
            {todoList.length > 0 && (
              <input type="checkbox" onChange={handleToggleAll} />
            )}
            <input
              type="text"
              ref={todoInputEl}
              placeholder="What needs to be done?"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div>
          <ul>
            {todoListDisplay.map((todoItem) => (
              <li key={`todoItem_${todoItem.id}`}>
                <TodoItem item={todoItem} updateTodoItem={updateTodoItem} />
              </li>
            ))}
          </ul>
          <div>
            <span>
              {`${
                todoList.filter(({ completed }) => completed === false).length
              } items left`}
            </span>
            <div>
              <button
                type="button"
                onClick={() => setActiveView(ActiveViewType.ALL)}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveView(ActiveViewType.ACTIVE)}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setActiveView(ActiveViewType.COMPLETED)}
              >
                Completed
              </button>
            </div>
            {todoList.filter(({ completed }) => completed === true).length >
              0 && (
              <button type="button" onClick={handleClearCompleted}>
                Clear completed
              </button>
            )}
          </div>
        </div>
      </TodosWrapper>
    </Container>
  )
}

export default App

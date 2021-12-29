import React, { MutableRefObject, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import useLocalStorage from '../hooks/useLocalStorage'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 40px;
`

const TodosWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
`

const ActiveViewSelector = styled.div<{ $activeView: TActiveView }>`
  [class^='active-view-btn-'] {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 3px 7px;

    &:hover {
      border-color: rgba(175, 47, 47, 0.1);
    }
  }

  ${({ $activeView }) =>
    `.active-view-btn-${$activeView} { border-color: rgba(175,47,47,0.15); }`}
`

const TodoItemWrapper = styled.div<{
  $isEditing: boolean
  $isCompleted: boolean
}>`
  [type='button'] {
    opacity: 0;
  }
  &:hover {
    [type='button'] {
      opacity: 1;
    }
  }

  [type='checkbox'],
  [type='button'],
  .item-description {
    display: ${({ $isEditing }) => ($isEditing ? 'none' : 'initial')};
  }

  [type='text'] {
    display: ${({ $isEditing }) => ($isEditing ? 'initial' : 'none')};
  }

  .item-description {
    text-decoration: ${({ $isCompleted }) =>
      $isCompleted ? 'line-through' : 'none'};
    color: ${({ $isCompleted }) => ($isCompleted ? '#d9d9d9' : 'unset')};
  }
`

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
    /* TODO: if focused on other item, isEditing => false */
    <TodoItemWrapper
      $isEditing={isEditing}
      $isCompleted={item.completed}
      className="relative flex py-4 pl-10 pr-4"
    >
      <input
        className="absolute left-3 top-7"
        type="checkbox"
        onChange={handleToggleCompleted}
        checked={item.completed}
      />
      <div className="relative flex grow">
        <span
          className="item-description grow text-2xl border border-transparent"
          onDoubleClick={handleEdit}
        >
          {item.description}
        </span>
        <input
          className="w-full text-2xl outline-none border"
          type="text"
          ref={todoEditInputEl}
          defaultValue={item.description}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button type="button" onClick={handleDeleteItem}>
        X
      </button>
    </TodoItemWrapper>
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
        <div className="w-full flex flex-col items-center">
          <h1 className="text-[100px] text-[rgba(175,47,47,0.15)] font-thin">
            todos
          </h1>
          <div className="relative w-1/2 shadow-lg py-4 pl-10">
            {/* TODO: if all completed -> active */}
            {todoList.length > 0 && (
              <input
                className="absolute left-3 top-7"
                type="checkbox"
                onChange={handleToggleAll}
              />
            )}
            <input
              className="w-full text-2xl placeholder:italic placeholder:font-thin"
              type="text"
              ref={todoInputEl}
              placeholder="What needs to be done?"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        {todoList.length > 0 && (
          <div className="w-1/2 shadow-lg">
            <ul className="divide-y divide-solid">
              {todoListDisplay.map((todoItem) => (
                <li key={`todoItem_${todoItem.id}`}>
                  <TodoItem item={todoItem} updateTodoItem={updateTodoItem} />
                </li>
              ))}
            </ul>
            <div className="h-10 flex items-center py-3 px-4 border-t-[1px]">
              <div className="w-1/3">
                {`${
                  todoList.filter(({ completed }) => completed === false).length
                } items left`}
              </div>
              <ActiveViewSelector
                $activeView={activeView}
                className="w-1/3 flex justify-between"
              >
                <button
                  type="button"
                  className="active-view-btn-ALL"
                  onClick={() => setActiveView(ActiveViewType.ALL)}
                >
                  All
                </button>
                <button
                  type="button"
                  className="active-view-btn-ACTIVE"
                  onClick={() => setActiveView(ActiveViewType.ACTIVE)}
                >
                  Active
                </button>
                <button
                  type="button"
                  className="active-view-btn-COMPLETED"
                  onClick={() => setActiveView(ActiveViewType.COMPLETED)}
                >
                  Completed
                </button>
              </ActiveViewSelector>
              {todoList.filter(({ completed }) => completed === true).length >
                0 && (
                <button
                  className="w-max ml-auto hover:underline"
                  type="button"
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              )}
            </div>
          </div>
        )}
      </TodosWrapper>
    </Container>
  )
}

export default App

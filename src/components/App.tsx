import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 40px;
`

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: gray;
  margin: 40px;
  padding: 10px;
  border-radius: 4px;
`

function App(): JSX.Element {
  const [counter, setCounter] = useState(0)
  const [guest, setGuest] = useState<string>('')

  const inputRef = useRef() as MutableRefObject<HTMLInputElement>

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounter(counter + 1)
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [counter])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setGuest(inputRef.current.value)
  }

  const getMessage = useCallback((scope: string, name: string) => {
    console.log(`running ${scope} ...`)
    return name ? `Hello, ${name}` : 'who are you?'
  }, [])

  const a = useMemo(() => {
    return getMessage('a', guest)
  }, [getMessage, guest])

  const b = getMessage('b', guest)

  console.log('render...')

  return (
    <Container>
      <h1>Welcome, edit me! {counter}</h1>
      <div className="w-full my-10 px-10 grid gap-4 desktop:grid-cols-4 tablet:grid-cols-3 grid-cols-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className="pt-1 text-center border-2 border-purple-900 bg-purple-300"
            key={index}
          >
            {index}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap">
        <h2 className="w-full">a: {a}</h2>
        <h2 className="w-full">b: {b}</h2>
      </div>
      <Form onSubmit={onSubmit} data-test-id="guest-form">
        <label className="w-full p-1 border">
          Name:
          <input type="text" ref={inputRef} className="ml-4" />
        </label>
        <div className="flex justify-around mt-4">
          <button type="submit" className="bg-white rounded p-1">
            submit
          </button>
          <button
            type="button"
            className="bg-red-500 rounded-2xl p-1 text-white"
            onClick={() => {
              inputRef.current.value = ''
              setGuest('')
            }}
          >
            reset
          </button>
        </div>
      </Form>
    </Container>
  )
}

export default App

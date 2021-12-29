import React, { useState, useEffect } from 'react'

const getStorageValue = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key)
  const initial = JSON.parse(saved || '""')
  return initial || defaultValue
}

const useLocalStorage = <T,>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState(() => {
    return getStorageValue<T>(key, defaultValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage

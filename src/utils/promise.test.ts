import { isOK, wrapPromise } from './promise'

test('isOk', () => {
  expect(
    isOK({
      resultData: 'hello',
      resultCode: 0,
    }),
  ).toBeTruthy()

  expect(
    isOK({
      errorData: {
        msg: 'error',
        code: 'error',
      },
      resultCode: -1,
    }),
  ).toBeFalsy()
})

test('resolve successful promise', async () => {
  const fake = {
    resultData: 'hello',
    resultCode: 0,
  }
  const result = await wrapPromise<string>(
    new Promise((resolve) => {
      resolve({
        data: fake,
      })
    }),
  )
  expect(result).toEqual(fake)
})

test('resolve failed promise', async () => {
  const fake = {
    errorData: {
      msg: 'error',
      code: 'error',
    },
    resultCode: -1,
  }
  const result = await wrapPromise<string>(
    new Promise((resolve) => {
      resolve({
        data: fake,
      })
    }),
  )
  expect(result).toEqual(fake)
})

test('resolve promise with exceptions', async () => {
  const result = await wrapPromise<string>(
    new Promise((_, reject) => {
      reject('error')
    }),
  )
  expect(result).toEqual({ errorData: { code: '', msg: '' }, resultCode: -1 })
})

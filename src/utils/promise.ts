interface DataOk<T> {
  resultData: T
  resultCode: number
}

interface DataFail {
  errorData: {
    msg: string
    code: string
  }
  resultCode: number
}

type BridgeResponse<T> = {
  data: DataOk<T> | DataFail
}

export function isOK<T>(data: DataOk<T> | DataFail): data is DataOk<T> {
  return 'resultData' in data
}

export function wrapPromise<T>(
  source: Promise<BridgeResponse<T>>,
): Promise<DataOk<T> | DataFail> {
  return new Promise((resolve, reject) => {
    source
      .then((value) => {
        if (value.data.resultCode === 0) {
          resolve(value.data as DataOk<T>)
        } else {
          // handle error
          resolve(value.data as DataFail)
        }
      })
      .catch(() => {
        // handle error
        resolve({
          resultCode: -1,
          errorData: {
            msg: '',
            code: '',
          },
        })
      })
  })
}

const info = (...params) => {
  if (process.env.NODE_ENV !== 'prod') { 
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'prod') { 
    console.error(...params)
  }
}

export default {
  info, 
  error,
}
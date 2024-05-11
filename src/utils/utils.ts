const parseBoolean = (value: string) => {
  switch (value) {
    case 'true':
      return true
    case 'false':
    default:
      return false
  }
}

export { parseBoolean }


const prettifyId = (schema) => {
  schema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      return returnedObject;
    }
  })
}

export {
  prettifyId
}
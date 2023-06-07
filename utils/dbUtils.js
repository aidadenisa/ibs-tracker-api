
const prettifyId = (schema) => {
  schema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      //the password should not be returned
      returnedObject.hash && delete returnedObject.hash
      return returnedObject;
    }
  })
}

export {
  prettifyId
}
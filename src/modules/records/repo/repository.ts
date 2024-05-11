import { InternalError } from '@/utils/errors'
import Record from './record.js'

const deleteRecord = async (
  recordId: string
): Promise<null | InternalError> => {
  // TODO: REMOVE RECORD ID FROM THE USER COLLECTION
  try {
    await Record.findByIdAndDelete(recordId)
  } catch (err) {
    return {
      message: `error while deleting record with id ${recordId}: ${err.message}`,
    } as InternalError
  }
  return null
}

export default { deleteRecord }

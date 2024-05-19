import express from 'express'
import { getRecordsController } from '@/modules/records/controllers/get_records'
import { postRecordsController } from '@/modules/records/controllers/post_records'
import { postRecordsMultipleController } from '@/modules/records/controllers/post_records_multiple'
import { deleteRecordController } from '@/modules/records/controllers//delete_record'

const router = express.Router()

router.get('/', getRecordsController)

router.post('/', postRecordsController)
router.post('/multiple', postRecordsMultipleController)

router.delete('/:id', deleteRecordController)

export default router

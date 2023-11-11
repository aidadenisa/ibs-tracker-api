import { IMPORT_FROM_BOWELLE } from '../utils/config.js'
import categoriesService from './categories.js'
import mongoose from 'mongoose'
import recordsService from './records.js'
import { utcToZonedTime, toDate } from 'date-fns-tz'

const importData = async (source, userId, importData) => {
  // for now, only support import from Bowelle
  if(source !== IMPORT_FROM_BOWELLE) return;

  if(!userId || !importData || !importData.length) return;
  const records = []
  // Bowelle data on stool
  const stoolCategory = await categoriesService.getCategoryByCode('STOOL', true);

  const _userId = new mongoose.Types.ObjectId(userId)
  for(let i=0; i<importData.length; i++ ) {
    const event = matchRecordToEventInCategory(importData[i], stoolCategory)
    
    records.push({
      day: importData[i].date,
      timezone: 'Europe/Rome', // hardcode for my case; should be coming from import data 
      createdOn: toDate(new Date(importData[i].date), { timeZone: 'Europe/Rome', }), // try to mimic when it was created
      event: event._id,
      user: _userId
    })
  }
  
  const result = await recordsService.createNewRecords(records, _userId)
  return result
}

const matchRecordToEventInCategory = (record, stoolCategory) => {
  switch(record.consistency) {
    case 'hard':
      return stoolCategory.events.find(event => event.code === 'HARD')
    case 'normal':
      return stoolCategory.events.find(event => event.code === 'NORMAL')
    case 'loose':
      return stoolCategory.events.find(event => event.code === 'SOFT')
    default:
      return stoolCategory.events.find(event => event.code === 'NORMAL')
  }
}

export default {
  importData
}
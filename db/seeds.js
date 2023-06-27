import Category from '../models/category.js';
import Event from '../models/event.js';
import logger from '../utils/logger.js';

const categories = [
  {
    name: 'Symptom',
  },{
    name: 'Stool',
  },{
    name: 'Menstruation',
  },
];

const events = {
  'SYMPTOM': [
    {
      name: 'Bloating',
    },{
      name: 'Burping',
    },{
      name: 'Reflux',
    },{
      name: 'Gas',
    },{
      name: 'Nausea',
    },{
      name: 'Heartburn',
    },{
      name: 'Cramps',
    },{
      name: 'Anxiety',
    },{
      name: 'Insomnia',
    },{
      name: 'Sweating',
    },{
      name: 'Constipation',
    },{
      name: 'Diarrhea',
    },{
      name: 'Pelvic Pain',
    },{
      name: 'Pelvic Burning',
    },
  ],
  'STOOL': [
    {
      name: 'Normal',
    },{
      name: 'Hard',
    },{
      name: 'Soft',
    },
  ],
  'MENSTRUATION': [
    {
      name: 'Light',
    },{
      name: 'Normal',
    },{
      name: 'Heavy',
    },
  ],
};


const seedCategory = async (category, events) => {
  const eventIds = events.map(event => event._id);
  const existingCategory = await Category.findOne({ code: category.name.toUpperCase()});
  if(!existingCategory) {
    return await (new Category({ 
      name: category.name, 
      code: category.name.toUpperCase(),
      events: [...eventIds]
    })).save();
  }
  return existingCategory;
}

const seedEvent= async (categoryCode) => {
  const existingEvents = await Event.find({ category_code: categoryCode });
  if(!existingEvents.length) {
    return await Event.insertMany(
      events[categoryCode].map( e => ({
        name: e.name,
        code: e.name.toUpperCase(),
        category_code: categoryCode,
      }))
    );
  }
  return existingEvents;
}

const seedDB = async () => {
  for(let i=0; i < categories.length; i++ ) {
    const events = await seedEvent(categories[i].name.toUpperCase());
    try {
      await seedCategory(categories[i], events);
    } catch(err) { logger(err) }
  }
}

export {
  seedDB,
  categories,
  events
};
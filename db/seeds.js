import Category from '../models/category.js';
import Event from '../models/event.js';
import mongoose from 'mongoose';

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
      name: 'Heartburn',
    },{
      name: 'Reflux',
    },{
      name: 'Burning',
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
      name: 'Period Start',
    },{
      name: 'Period End',
    },
  ],
};


const seedCategories = async () => {
  const existingCategories = await Category.find({});
  if(!existingCategories.length) {
    return await Category.insertMany(
      categories.map(c => ({ name: c.name, code: c.name.toUpperCase() }))
    );
  }
  return existingCategories;
}

const seedEvent= async (currentCategories, categoryCode) => {
  const categoryID = currentCategories.find(e => e.code === categoryCode).toJSON().id;
  const existingEvents = await Event.find({ category: mongoose.Types.ObjectId(categoryID) });
  if(!existingEvents.length) {
    return await Event.insertMany(
      events[categoryCode].map( e => ({
        name: e.name,
        code: e.name.toUpperCase(),
        category: mongoose.Types.ObjectId(categoryID),
      }))
    );
  }
  return existingEvents;
}

const seedDB = async () => {
  const currentCategories = await seedCategories();
  await seedEvent(currentCategories, 'SYMPTOM');
  await seedEvent(currentCategories, 'STOOL');
  await seedEvent(currentCategories, 'MENSTRUATION');
}

export {
  seedDB,
  categories,
  events
};
import Category from '@/modules/events/repo/category'
import { Event } from '@/modules/events/repo/event'
import logger from '@/utils/logger'

const categoriesEventsMap = new Map(
  Object.entries({
    Symptom: [
      {
        name: 'Bloating',
      },
      {
        name: 'Burping',
      },
      {
        name: 'Reflux',
      },
      {
        name: 'Gas',
      },
      {
        name: 'Nausea',
      },
      {
        name: 'Heartburn',
      },
      {
        name: 'Cramps',
      },
      {
        name: 'Anxiety',
      },
      {
        name: 'Insomnia',
      },
      {
        name: 'Sweating',
      },
      {
        name: 'Constipation',
      },
      {
        name: 'Diarrhea',
      },
      {
        name: 'Pelvic Pain',
      },
      {
        name: 'Pelvic Burning',
      },
    ],
    Stool: [
      {
        name: 'Normal',
      },
      {
        name: 'Hard',
      },
      {
        name: 'Soft',
      },
    ],
    Menstruation: [
      {
        name: 'Light',
      },
      {
        name: 'Normal',
      },
      {
        name: 'Heavy',
      },
    ],
    Food: [
      {
        name: 'Dairy',
      },
      {
        name: 'Bread',
      },
      {
        name: 'Pastry',
      },
      {
        name: 'Pasta',
      },
      {
        name: 'Chicken',
      },
      {
        name: 'Fish',
      },
      {
        name: 'Beef',
      },
      {
        name: 'Rice',
      },
      {
        name: 'Alcohol',
      },
      {
        name: 'Vegetables',
      },
      {
        name: 'Legumes',
      },
      {
        name: 'Fruit',
      },
      {
        name: 'Desert',
      },
      {
        name: 'Potatoes',
      },
      {
        name: 'Plant-Based Milk',
      },
      {
        name: 'Soup',
      },
      {
        name: 'Cereals',
      },
    ],
  })
)

const seedCategory = async (categoryName) => {
  const existingCategory = await Category.findOne({
    code: categoryName.toUpperCase(),
  })
  const eventsIds = (
    await Event.find({ category_code: categoryName.toUpperCase() })
  ).map((e) => e._id)
  if (!existingCategory) {
    return await new Category({
      name: categoryName,
      code: categoryName.toUpperCase(),
      events: [...eventsIds],
    }).save()
  }
  await Category.updateOne(
    { _id: existingCategory._id },
    {
      events: [...eventsIds],
    }
  )
}

const seedEvents = async (categoryCode, events) => {
  const existingEvents = await Event.find({ category_code: categoryCode })
  const existingEventsNames = existingEvents.map((e) => e.name)
  for (let i = 0; i < events.length; i++) {
    if (existingEventsNames.indexOf(events[i].name) === -1) {
      await new Event({
        name: events[i].name,
        code: events[i].name.toUpperCase(),
        category_code: categoryCode,
      }).save()
    }
  }
}

const seedDB = async () => {
  try {
    for (const [c, e] of categoriesEventsMap.entries()) {
      await seedEvents(c.toUpperCase(), e)
      seedCategory(c)
    }
  } catch (err) {
    logger.error(err)
  }
}

export { seedDB }

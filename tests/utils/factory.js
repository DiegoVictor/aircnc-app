import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Spot',
  {},
  {
    _id: () => String(faker.datatype.number()),
    user: null,
    company: faker.company.companyName,
    price: () => Number(faker.finance.amount()),
    thumbnail: faker.image.image,
    thumbnail_url: faker.image.imageUrl,
    techs: () => {
      const techs = [];
      for (let i = 0; i < faker.datatype.number({ min: 1, max: 5 }); i += 1) {
        techs.push(faker.random.word());
      }
      return techs;
    },
  }
);

factory.define(
  'Booking',
  {},
  {
    _id: () => String(faker.datatype.number()),
    date: () => faker.date.future().toISOString(),
    user: {
      email: faker.internet.email,
    },
    spot: {
      company: faker.company.companyName,
      thumbnail_url: faker.image.imageUrl,
      price: () => Number(faker.finance.amount()),
    },
    approved: faker.datatype.boolean,
  }
);

export default factory;

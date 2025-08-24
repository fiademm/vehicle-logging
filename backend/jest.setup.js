const { seed } = require('./scripts/seed');

module.exports = async () => {
  await seed();
};
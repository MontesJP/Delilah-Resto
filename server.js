const mongoose = require('mongoose');
const { config } = require('dotenv');

config({ path: './config.env' });
const app = require('./app');

// DATABASE: mongodb+srv://acamica-test:<PASSWORD>@clusterdelilahresto.v7tig.mongodb.net/Delilah-Resto?retryWrites=true&w=majority
// DATABASE_PASSWORD: qf56RvaPMiOhayJO

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

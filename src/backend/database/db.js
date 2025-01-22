import { Sequelize } from "sequelize";


const sequelize = new Sequelize({
    dialect:"sqlite",
    storage: "src/backend/database.sqlite"
});

const testConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log('Conexiune cu baza de date reușită!');
    } catch (err) {
      console.error('Eroare la conexiunea bazei de date!', err);
    }
  };

testConnection();

export default sequelize
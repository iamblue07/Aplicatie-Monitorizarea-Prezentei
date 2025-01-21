import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const participant = sequelize.define('participant', {
  id_participant: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  esteOrganizer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
},{
  timestamps:false,
  tableName:'participant'
});

export default participant;

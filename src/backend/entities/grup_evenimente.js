import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const grup_evenimente = sequelize.define('grup_evenimente', {
  id_grup: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titlu_grup: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
  timestamps:false,
  tableName:'grup_evenimente',
});

export default grup_evenimente;
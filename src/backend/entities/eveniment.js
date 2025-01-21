import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import grup_evenimente from "./grup_evenimente.js";

const eveniment = sequelize.define('Eveniment', {
  id_eveniment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_grup: {
    type: DataTypes.BIGINT,
    references: {
      model: grup_evenimente,
      key: 'id_grup',
    },
    allowNull: false,
  },
  titlu_eveniment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descriere_eveniment: {
    type: DataTypes.STRING,
  },
  data_start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  data_stop: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  cod_acces: {
    type: DataTypes.STRING,
    unique:true
  },
},{
  timestamps:false,
  tableName:'eveniment'
});

grup_evenimente.hasMany(eveniment, { foreignKey: 'id_grup', as: 'evenimente_asociate' });
eveniment.belongsTo(grup_evenimente, { foreignKey: 'id_grup', as: 'grup_asociat' });

export default eveniment;

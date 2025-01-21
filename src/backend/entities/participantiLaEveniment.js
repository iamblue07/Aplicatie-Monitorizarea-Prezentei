import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import eveniment from './eveniment.js';
import participant from './participant.js';

const participantiLaEveniment = sequelize.define('participantiLaEveniment', {
  id_eveniment: {
    type: DataTypes.INTEGER,
    references: {
      model: eveniment,
      key: 'id_eveniment',
    },
    allowNull: false,
  },
  id_participant: {
    type: DataTypes.BIGINT,
    references: {
      model: participant,
      key: 'id_participant',
    },
    allowNull: false,
  },
  data_confirmare: {
    type: DataTypes.DATE,
    allowNull: false,
  },
},{
  timestamps:false,
  tableName:'participantiLaEvenimente'
});

eveniment.belongsToMany(participant, { through: participantiLaEveniment, foreignKey: 'id_eveniment', as: "participanti_asociati"});
participant.belongsToMany(eveniment, { through: participantiLaEveniment, foreignKey: 'id_participant', as: "evenimentele_participantilor"});

export default participantiLaEveniment;

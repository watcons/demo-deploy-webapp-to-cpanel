import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { DbRoll } from "./interfaces/db-roll";

export class PersistedRoll
  extends Model<
    InferAttributes<PersistedRoll>,
    InferCreationAttributes<PersistedRoll>
  >
  implements DbRoll
{
  declare id: CreationOptional<number>;

  declare rollResult: number;
}

export const initRoll = (sequelize: Sequelize) =>
  PersistedRoll.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rollResult: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Roll",
    }
  );

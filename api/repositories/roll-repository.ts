import { Op } from "sequelize";
import { PersistedRoll } from "../db/roll";

const MAX_ROLLS = 10;

export const createRoll = (rollValue: number) => {
  return PersistedRoll.create({ rollResult: rollValue });
};

export const getRolls = () => {
  return PersistedRoll.findAll();
};

export const trimRolls = async () => {
  const maxRollId = await getMaximumRollId();
  const minRollId = maxRollId - MAX_ROLLS + 1;
  return PersistedRoll.destroy({ where: { id: { [Op.lt]: minRollId } } });
};

const getMaximumRollId = async () => {
  const roll = await PersistedRoll.findOne({ order: [["id", "DESC"]] });
  return roll?.id || 0;
};

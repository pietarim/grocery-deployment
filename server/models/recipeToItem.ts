import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface RecipeToItemAttributes {
  id: number;
  recipeId: number;
  itemId: number;
  ammount: number;
}

type RecipeToItemCreationAttributes = Optional<RecipeToItemAttributes, 'id'>; // TODO: is this needed?

class RecipeToItem extends Model<RecipeToItemAttributes, RecipeToItemCreationAttributes> {
  declare id: number;
  declare recipeId: number;
  declare itemId: number;
  declare ammount: number;
}
RecipeToItem.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recipes',
      key: 'id'
    },
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'incredients',
      key: 'id'
    },
  },
  ammount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'recipeToItem',
});

export { RecipeToItem };
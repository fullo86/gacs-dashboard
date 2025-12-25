import connectDB from "@/lib/db";
import { DataTypes, UUIDV4 } from "sequelize";
import User from "../users/User";

const Configuration = connectDB.define(
  "Configuration",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => UUIDV4(),
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    config_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    config_value: {
      type: DataTypes.TEXT
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "configurations",
    timestamps: false, 
  }
);

Configuration.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default Configuration;

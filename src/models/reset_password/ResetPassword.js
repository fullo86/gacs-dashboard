import connectDB from "@/lib/db";
import { DataTypes } from "sequelize";
import User from "../users/User";

const PasswordReset = connectDB.define(
  "PasswordReset",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
    tableName: "password_resets",
    timestamps: false, 
  }
);

PasswordReset.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default PasswordReset;

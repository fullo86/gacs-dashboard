import { DataTypes } from 'sequelize';
import connectDB from "@/lib/db";

const DeviceTags = connectDB.define(
  "DeviceTags",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    device_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize: connectDB,
    modelName: 'DeviceTags',
    tableName: 'tags',
    timestamps: true, 
    underscored: true
  }
);

export default DeviceTags;

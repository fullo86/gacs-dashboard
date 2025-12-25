import connectDB from "@/lib/db";
import { DataTypes } from "sequelize";
import User from "../users/User";

const MacVendorCache = connectDB.define(
  "MacVendorCache",
  {
    oui: {
      type: DataTypes.STRING(6),
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vendor_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cached_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
  },
  {
    tableName: "mac_vendor_cache",
    timestamps: false, 
  }
);

MacVendorCache.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default MacVendorCache;

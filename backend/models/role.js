// Filename: Model\role.js

import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, {
  timestamps: true
});

const Role = mongoose.model("Role", RoleSchema);

export default Role;

// CRUD Operations for Role model

// Create a new role
export const addRole = async (roleData) => {
  try {
    const newRole = await Role.create(roleData);
    return newRole;
  } catch (error) {
    throw new Error("Could not create role: " + error.message);
  }
};

// Read all roles
export const getAllRoles = async () => {
  try {
    const allRoles = await Role.find();
    return allRoles;
  } catch (error) {
    throw new Error("Could not fetch roles: " + error.message);
  }
};

// Read a single role by ID
export const getRoleById = async (roleId) => {
  try {
    const role = await Role.findById(roleId);
    return role;
  } catch (error) {
    throw new Error("Could not find role: " + error.message);
  }
};

// Update a role by ID
export const updateRole = async (roleId, updatedData) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(roleId, updatedData, { new: true });
    return updatedRole;
  } catch (error) {
    throw new Error("Could not update role: " + error.message);
  }
};

// Delete a role by ID
export const deleteRole = async (roleId) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(roleId);
    return deletedRole;
  } catch (error) {
    throw new Error("Could not delete role: " + error.message);
  }
};

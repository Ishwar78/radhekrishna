import mongoose from 'mongoose';

export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const validateObjectId = (id, fieldName = 'ID') => {
  if (!isValidObjectId(id)) {
    return {
      valid: false,
      error: `Invalid ${fieldName}`
    };
  }
  return { valid: true };
};

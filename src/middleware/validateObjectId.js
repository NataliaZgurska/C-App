import mongoose from 'mongoose';

export const validateObjectId = (req, res, next) => {
  const id = req.params.contactId;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      status: 400,
      message: 'Bad request (something wrong in id or request body)',
    });
  }
  next();
};

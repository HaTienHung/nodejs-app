import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export default function validateObjectIdExists(model, param = "id") {
  return async function (req, res, next) {
    const id = req.params[param];

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const record = await model.findOneWithDeleted({ _id: id });

    if (!record) {
      return res.status(404).json({ message: `${model.modelName} not found` });
    }

    next();
  };
}

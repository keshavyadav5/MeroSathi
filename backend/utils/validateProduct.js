const Joi = require('joi');

const productSchema = Joi.object({
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  // imageUrl: Joi.string().uri().optional(),
  imageUrl: Joi.string().optional(),
  name: Joi.string().required(),
  size: Joi.string().required(),
  format: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().required(),
  pages: Joi.number().required(),
  copy: Joi.number().optional(),
  papersize: Joi.string().optional(),
  papertype: Joi.string().optional(),
  binding: Joi.string().optional(),
  printingside: Joi.string().optional(),
  orientation: Joi.string().optional(),
  printcolor: Joi.string().optional(),
  productname: Joi.string().required(),
});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = validateProduct;

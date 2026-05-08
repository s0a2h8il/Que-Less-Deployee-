import { body } from "express-validator";

export const businessValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Business name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
  
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required"),
  
  body("addressLine1")
    .trim()
    .notEmpty().withMessage("Address Line 1 is required")
    .isLength({ min: 3 }).withMessage("Address must be at least 3 characters"),

  body("areaName")
    .optional()
    .trim(),

  body("pincode")
    .optional()
    .trim(),
  
  body("city")
    .trim()
    .notEmpty().withMessage("City is required"),
  
  body("phone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage("Phone number must be between 10 and 15 digits"),
  
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please provide a valid business email"),
];

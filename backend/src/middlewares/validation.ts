import { celebrate, Joi, Segments } from 'celebrate';

import { PRODUCT_CATEGORIES } from '../models/product';

const createProductBodySchema = Joi.object({
  title: Joi.string().required().min(2).max(30)
    .messages({
      'string.empty': 'Поле "title" должно быть заполнено',
      'string.min': 'Минимальная длина поля "title" - 2',
      'string.max': 'Максимальная длина поля "title" - 30',
      'any.required': 'Поле "title" должно быть заполнено',
    }),
  image: Joi.object({
    fileName: Joi.string().required().messages({
      'string.empty': 'Поле "image.fileName" должно быть заполнено',
      'any.required': 'Поле "image.fileName" должно быть заполнено',
    }),
    originalName: Joi.string().required().messages({
      'string.empty': 'Поле "image.originalName" должно быть заполнено',
      'any.required': 'Поле "image.originalName" должно быть заполнено',
    }),
  }).required().messages({
    'any.required': 'Поле "image" должно быть заполнено',
  }),
  category: Joi.string().valid(...PRODUCT_CATEGORIES).required().messages({
    'any.only': 'Недопустимое значение поля "category"',
    'any.required': 'Поле "category" должно быть заполнено',
  }),
  description: Joi.string().optional(),
  price: Joi.number().allow(null).optional(),
});

const orderItemObjectId = Joi.string().hex().length(24).messages({
  'string.hex': 'Некорректный идентификатор товара',
  'string.length': 'Некорректный идентификатор товара',
});

const createOrderBodySchema = Joi.object({
  payment: Joi.string().valid('card', 'online').required().messages({
    'any.only': 'Некорректный способ оплаты',
    'any.required': 'Некорректный способ оплаты',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Некорректный email',
    'any.required': 'Некорректный email',
  }),
  phone: Joi.string().trim().min(1).required()
    .messages({
      'string.min': 'Телефон обязателен',
      'any.required': 'Телефон обязателен',
    }),
  address: Joi.string().trim().min(1).required()
    .messages({
      'string.min': 'Адрес обязателен',
      'any.required': 'Адрес обязателен',
    }),
  total: Joi.number().required().messages({
    'number.base': 'Некорректная сумма заказа',
    'any.required': 'Некорректная сумма заказа',
  }),
  items: Joi.array().items(orderItemObjectId).min(1).required()
    .messages({
      'array.min': 'Список товаров не может быть пустым',
      'any.required': 'Список товаров не может быть пустым',
    }),
});

export const validateCreateProductBody = celebrate({
  [Segments.BODY]: createProductBodySchema,
});

export const validateCreateOrderBody = celebrate({
  [Segments.BODY]: createOrderBodySchema,
});

const productIdParamSchema = Joi.object({
  productId: Joi.string().hex().length(24).required()
    .messages({
      'string.hex': 'Некорректный идентификатор товара',
      'string.length': 'Некорректный идентификатор товара',
      'any.required': 'Некорректный идентификатор товара',
    }),
});

export const validateProductIdParam = celebrate({
  [Segments.PARAMS]: productIdParamSchema,
});

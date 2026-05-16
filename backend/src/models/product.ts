import mongoose from 'mongoose';

export const PRODUCT_CATEGORIES = [
  'софт-скил',
  'хард-скил',
  'другое',
  'дополнительное',
  'кнопка',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: ProductCategory;
  description?: string;
  price: number | null;
}

const imageSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'Поле "image.fileName" должно быть заполнено'],
    },
    originalName: {
      type: String,
      required: [true, 'Поле "image.originalName" должно быть заполнено'],
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Поле "title" должно быть заполнено'],
      unique: true,
      minlength: [2, 'Минимальная длина поля "title" - 2'],
      maxlength: [30, 'Максимальная длина поля "title" - 30'],
    },
    image: {
      type: imageSchema,
      required: [true, 'Поле "image" должно быть заполнено'],
    },
    category: {
      type: String,
      required: [true, 'Поле "category" должно быть заполнено'],
      enum: {
        values: [...PRODUCT_CATEGORIES],
        message: 'Недопустимое значение поля "category"',
      },
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      default: null,
    },
  },
  { versionKey: false },
);

export default mongoose.model<IProduct>('product', productSchema);

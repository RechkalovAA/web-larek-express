import type { Types } from 'mongoose';

export interface PublicProduct {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number | null;
  image: {
    fileName: string;
    originalName: string;
  };
}

export type LeanProductLike = {
  _id: Types.ObjectId | string;
  title: string;
  category: string;
  description?: string;
  price: number | null;
  image: {
    fileName: string;
    originalName: string;
  };
};

export function toPublicProduct(doc: LeanProductLike): PublicProduct {
  return {
    _id: String(doc._id),
    title: doc.title,
    category: doc.category,
    description: doc.description ?? '',
    price: doc.price,
    image: doc.image,
  };
}

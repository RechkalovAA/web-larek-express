import { faker } from '@faker-js/faker';
import type { NextFunction, Request, Response } from 'express';

import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

interface OrderRequestBody {
  total: number;
  items: string[];
}

export default async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { total, items: itemIds } = req.body as OrderRequestBody;

    const uniqueIds = [...new Set(itemIds)];
    const products = await Product.find({ _id: { $in: uniqueIds } }).lean();
    const byId = new Map(
      products.map((p) => [String(p._id), p] as const),
    );

    let blockingMessage: string | null = null;
    const computedTotal = itemIds.reduce((acc, id) => {
      if (blockingMessage !== null) return acc;
      const productDoc = byId.get(id);
      if (!productDoc) {
        blockingMessage = `Товар с id ${id} не найден`;
        return acc;
      }
      const { price } = productDoc;
      if (price === null || price === undefined || typeof price !== 'number') {
        blockingMessage = `Товар с id ${id} не продается`;
        return acc;
      }
      return acc + price;
    }, 0);

    if (blockingMessage !== null) {
      next(new BadRequestError(blockingMessage));
      return;
    }

    if (computedTotal !== total) {
      next(new BadRequestError('Неверная сумма заказа'));
      return;
    }

    res.status(200).json({
      id: faker.string.uuid(),
      total,
    });
  } catch (err: unknown) {
    next(err);
  }
}

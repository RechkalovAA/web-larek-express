import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import Product from '../models/product';
import { toPublicProduct, type LeanProductLike } from '../utils/product-public';

function isDuplicateKeyError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  if ('code' in err && (err as { code: number }).code === 11000) return true;
  return err instanceof Error && err.message.includes('E11000');
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const doc = await Product.findById(req.params.productId).lean<LeanProductLike | null>();
    if (!doc) {
      next(new NotFoundError('Товар не найден'));
      return;
    }
    res.status(200).json(toPublicProduct(doc));
  } catch (err: unknown) {
    next(err);
  }
}

export async function getProducts(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawItems = await Product.find().lean<LeanProductLike[]>();
    const items = rawItems.map(toPublicProduct);
    res.json({ items, total: items.length });
  } catch (err: unknown) {
    next(err);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const doc = await Product.create(req.body);
    const plain = doc.toObject() as LeanProductLike;
    res.status(200).json(toPublicProduct(plain));
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(err.message));
      return;
    }
    if (isDuplicateKeyError(err)) {
      next(new ConflictError('Товар с таким названием уже существует'));
      return;
    }
    next(err);
  }
}

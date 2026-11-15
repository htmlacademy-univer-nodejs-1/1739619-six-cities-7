import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/index.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';

export interface FavoriteService {
  add(dto: CreateFavoriteDto): Promise<DocumentType<OfferEntity>>;
  remove(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findByUserId(userId: string): Promise<DocumentType<OfferEntity>[]>;
}

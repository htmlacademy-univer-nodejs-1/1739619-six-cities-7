import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { AddOfferRatingDto } from './dto/add-offer-rating.dto.js';
import { City } from '../../types/index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: City, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  updateById(id: string, authorId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: string, authorId: string): Promise<DocumentType<OfferEntity> | null>;
  addRating(id: string, dto: AddOfferRatingDto): Promise<DocumentType<OfferEntity> | null>;
  exists(id: string): Promise<boolean>;
}

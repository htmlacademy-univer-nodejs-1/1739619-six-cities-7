import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { OfferEntity } from '../offer/index.js';
import { OfferService } from '../offer/index.js';
import { UserEntity } from '../user/index.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { FavoriteService } from './favorite-service.interface.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.UserModel) private readonly userModel: ReturnModelType<typeof UserEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async add(dto: CreateFavoriteDto): Promise<DocumentType<OfferEntity>> {
    if (!await this.offerService.exists(dto.offer)) {
      throw new Error('Offer not found');
    }
    const result = await this.userModel.updateOne(
      { _id: dto.user },
      { $addToSet: { favoriteOffers: dto.offer } },
    ).exec();
    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }
    const offer = await this.offerService.findById(dto.offer, dto.user);
    if (!offer) {
      await this.userModel.updateOne({ _id: dto.user }, { $pull: { favoriteOffers: dto.offer } }).exec();
      throw new Error('Offer not found');
    }
    return offer;
  }

  public async remove(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.userModel.updateOne({ _id: userId }, { $pull: { favoriteOffers: offerId } }).exec();
    return this.offerService.findById(offerId, userId);
  }

  public async findByUserId(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerService.findFavorites(userId);
  }
}

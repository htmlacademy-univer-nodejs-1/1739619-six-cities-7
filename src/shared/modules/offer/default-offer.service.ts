import { inject, injectable } from 'inversify';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { AddOfferRatingDto } from './dto/add-offer-rating.dto.js';
import { CommentEntity } from '../comment/index.js';
import { UserEntity } from '../user/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component, SortType } from '../../types/index.js';
import { DEFAULT_OFFER_COUNT, MAX_PREMIUM_OFFER_COUNT, OFFER_LIST_FIELDS } from './offer.constant.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: ReturnModelType<typeof OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: ReturnModelType<typeof CommentEntity>,
    @inject(Component.UserModel) private readonly userModel: ReturnModelType<typeof UserEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = new this.offerModel({
      ...this.getEditableFields(dto),
      author: dto.author,
      publicationDate: dto.publicationDate,
      rating: 0,
      ratingSum: 0,
      commentsCount: 0,
    });
    const result = await offer.save() as unknown as DocumentType<OfferEntity>;
    this.logger.info(`New offer created: ${dto.title}`);
    await result.populate('author');
    return result;
  }

  public async findById(id: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById<DocumentType<OfferEntity>>(id).exec();
    if (offer) {
      await offer.populate('author');
      await this.setFavoriteFlags([offer], userId);
    }
    return offer;
  }

  public async find(count = DEFAULT_OFFER_COUNT, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    if (!Number.isInteger(count) || count < 1) {
      throw new Error('Offers count must be a positive integer');
    }
    const offers = await this.offerModel.find<DocumentType<OfferEntity>>()
      .select(OFFER_LIST_FIELDS)
      .sort({ publicationDate: SortType.Down, _id: SortType.Down })
      .limit(count)
      .exec();
    return this.setFavoriteFlags(offers, userId);
  }

  public async findPremiumByCity(city: City, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel.find<DocumentType<OfferEntity>>({ city, isPremium: true })
      .select(OFFER_LIST_FIELDS)
      .sort({ publicationDate: SortType.Down, _id: SortType.Down })
      .limit(MAX_PREMIUM_OFFER_COUNT)
      .exec();
    return this.setFavoriteFlags(offers, userId);
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offerIds = await this.getFavoriteOfferIds(userId);
    const offers = await this.offerModel.find<DocumentType<OfferEntity>>({ _id: { $in: offerIds } })
      .select(OFFER_LIST_FIELDS)
      .sort({ publicationDate: SortType.Down, _id: SortType.Down })
      .exec();
    offers.forEach((offer) => {
      offer.$locals.isFavorite = true;
    });
    return offers;
  }

  public async updateById(id: string, authorId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findOneAndUpdate<DocumentType<OfferEntity>>(
      { _id: id, author: authorId },
      { $set: this.getEditableFields(dto) },
      { returnDocument: 'after' },
    ).exec();
    if (offer) {
      await offer.populate('author');
      await this.setFavoriteFlags([offer], authorId);
    }
    return offer;
  }

  public async deleteById(id: string, authorId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findOneAndDelete<DocumentType<OfferEntity>>({ _id: id, author: authorId }).exec();
    if (offer) {
      await this.commentModel.deleteMany({ offerId: id });
      await this.userModel.updateMany({ favoriteOffers: id }, { $pull: { favoriteOffers: id } }).exec();
    }
    return offer;
  }

  public async addRating(id: string, dto: AddOfferRatingDto): Promise<DocumentType<OfferEntity> | null> {
    // Both counters and the average change in one atomic update, including concurrent comments.
    return this.offerModel.findByIdAndUpdate<DocumentType<OfferEntity>>(id, [
      { $set: {
        commentsCount: { $add: [{ $ifNull: ['$commentsCount', 0] }, 1] },
        ratingSum: { $add: [{ $ifNull: ['$ratingSum', 0] }, { $literal: dto.rating }] },
      } },
      { $set: { rating: { $round: [{ $divide: ['$ratingSum', '$commentsCount'] }, 1] } } },
    ], { returnDocument: 'after', updatePipeline: true }).exec();
  }

  public async exists(id: string): Promise<boolean> {
    return await this.offerModel.exists({ _id: id }) !== null;
  }

  private getEditableFields(dto: UpdateOfferDto): UpdateOfferDto {
    const fields: UpdateOfferDto = {
      title: dto.title,
      description: dto.description,
      city: dto.city,
      previewImage: dto.previewImage,
      images: dto.images,
      isPremium: dto.isPremium,
      housingType: dto.housingType,
      roomsCount: dto.roomsCount,
      guestsCount: dto.guestsCount,
      rentPrice: dto.rentPrice,
      amenities: dto.amenities,
      coordinates: dto.coordinates,
    };
    return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
  }

  private async setFavoriteFlags(offers: DocumentType<OfferEntity>[], userId?: string): Promise<DocumentType<OfferEntity>[]> {
    if (!userId || offers.length === 0) {
      return offers;
    }
    const favoriteIds = new Set(await this.getFavoriteOfferIds(userId));
    offers.forEach((offer) => {
      offer.$locals.isFavorite = favoriteIds.has(offer.id);
    });
    return offers;
  }

  private async getFavoriteOfferIds(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId)
      .select('favoriteOffers')
      .lean<Pick<UserEntity, 'favoriteOffers'>>()
      .exec();
    return (user?.favoriteOffers ?? []).map((offerId) => offerId.toString());
  }
}

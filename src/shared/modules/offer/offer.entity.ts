import { defaultClasses, DocumentType, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { City, HousingType, Amenity } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

@modelOptions({ schemaOptions: { _id: false } })
class Coordinates {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_document, result) => {
        delete result.ratingSum;
        return result;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_document, result) => {
        delete result.ratingSum;
        return result;
      },
    },
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 10, maxlength: 100 })
  public title!: string;

  @prop({ required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({ required: true, default: Date.now })
  public publicationDate!: Date;

  @prop({ required: true, type: String, enum: City })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ default: 0 })
  public rating!: number;

  @prop({ default: 0, select: false })
  public ratingSum!: number;

  @prop({ required: true, type: String, enum: HousingType })
  public housingType!: HousingType;

  @prop({ required: true, min: 1, max: 8 })
  public roomsCount!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guestsCount!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public rentPrice!: number;

  @prop({ required: true, type: () => [String], enum: Amenity })
  public amenities!: Amenity[];

  @prop({ required: true, ref: () => UserEntity })
  public author!: Types.ObjectId;

  @prop({ default: 0 })
  public commentsCount!: number;

  @prop({ required: true })
  public coordinates!: Coordinates;

  public get isFavorite(): boolean {
    return Boolean((this as DocumentType<OfferEntity>).$locals.isFavorite);
  }
}

export const OfferModel = getModelForClass(OfferEntity);

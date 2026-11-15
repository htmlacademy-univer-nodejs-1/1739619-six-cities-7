import { defaultClasses, getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { OfferEntity } from '../offer/index.js';
import { UserEntity } from '../user/index.js';

export interface CommentEntity extends defaultClasses.Base {}

@index({ offerId: 1, publicationDate: -1, _id: -1 })
@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public text: string;

  @prop({ default: Date.now })
  public publicationDate: Date;

  @prop({ required: true })
  public rating: number;

  @prop({ required: true, ref: () => UserEntity })
  public userId: Types.ObjectId;

  @prop({ required: true, ref: () => OfferEntity })
  public offerId: Types.ObjectId;
}

export const CommentModel = getModelForClass(CommentEntity);

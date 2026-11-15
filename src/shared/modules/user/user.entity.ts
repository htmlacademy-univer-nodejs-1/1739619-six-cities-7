import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
    toJSON: {
      transform: (_document, result) => {
        delete result.password;
        return result;
      },
    },
    toObject: {
      transform: (_document, result) => {
        delete result.password;
        return result;
      },
    },
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, default: '', minlength: 1, maxlength: 15 })
  public name: string;

  @prop({ required: true, unique: true, match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/ })
  public email: string;

  @prop({ required: false, default: '/img/avatar-angelina.jpg', match: /\.(jpg|png)$/ })
  public avatarPath?: string;

  @prop({ required: true, type: String, enum: UserType })
  public type: UserType;

  @prop({ required: true, select: false })
  public password: string;

  @prop({ type: () => [Types.ObjectId], ref: 'OfferEntity', default: [], select: false })
  public favoriteOffers: Types.ObjectId[];

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);

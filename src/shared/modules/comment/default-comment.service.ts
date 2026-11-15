import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { OfferEntity, OfferService } from '../offer/index.js';
import { UserService } from '../user/index.js';
import { CommentEntity } from './comment.entity.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

import { MAX_COMMENT_COUNT } from './comment.constant.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: ReturnModelType<typeof CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    if (!await this.offerService.exists(dto.offerId)) {
      throw new Error('Offer not found');
    }
    if (!await this.userService.findById(dto.userId)) {
      throw new Error('Comment author not found');
    }

    const comment = await this.commentModel.create({
      text: dto.text,
      rating: dto.rating,
      userId: dto.userId,
      offerId: dto.offerId,
    }) as unknown as DocumentType<CommentEntity>;

    let offer: DocumentType<OfferEntity> | null;
    try {
      offer = await this.offerService.addRating(dto.offerId, { rating: dto.rating });
    } catch (error) {
      await this.commentModel.deleteOne({ _id: comment.id });
      throw error;
    }

    if (!offer) {
      await this.commentModel.deleteOne({ _id: comment.id });
      throw new Error('Offer not found');
    }

    await comment.populate('userId');
    return comment;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find<DocumentType<CommentEntity>>({ offerId })
      .sort({ publicationDate: SortType.Down, _id: SortType.Down })
      .limit(MAX_COMMENT_COUNT)
      .populate('userId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();
    return result.deletedCount;
  }
}

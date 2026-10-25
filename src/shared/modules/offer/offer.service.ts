import { inject, injectable } from 'inversify';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { OfferServiceInterface } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: ReturnModelType<typeof OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = new this.offerModel(dto);
    const result = await offer.save() as unknown as DocumentType<OfferEntity>;
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id);
  }
}

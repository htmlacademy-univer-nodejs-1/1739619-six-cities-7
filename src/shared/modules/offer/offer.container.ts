import { Container } from 'inversify';
import { ReturnModelType } from '@typegoose/typegoose';
import { OfferServiceInterface, OfferService, OfferEntity, OfferModel } from './index.js';
import { Component } from '../../types/index.js';

export function createOfferContainer() {
  const container = new Container();

  container.bind<OfferServiceInterface>(Component.OfferService).to(OfferService).inSingletonScope();
  container.bind<ReturnModelType<typeof OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return container;
}

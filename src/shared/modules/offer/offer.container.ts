import { Container } from 'inversify';
import { ReturnModelType } from '@typegoose/typegoose';
import { OfferService, DefaultOfferService, OfferEntity, OfferModel } from './index.js';
import { Component } from '../../types/index.js';

export function createOfferContainer() {
  const container = new Container();

  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<ReturnModelType<typeof OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return container;
}

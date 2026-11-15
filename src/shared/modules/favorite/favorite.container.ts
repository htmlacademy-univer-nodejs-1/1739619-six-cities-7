import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { DefaultFavoriteService } from './default-favorite.service.js';

export function createFavoriteContainer() {
  const container = new Container();
  container.bind<FavoriteService>(Component.FavoriteService).to(DefaultFavoriteService).inSingletonScope();
  return container;
}

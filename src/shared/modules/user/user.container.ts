import { Container } from 'inversify';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserService, DefaultUserService, UserEntity, UserModel } from './index.js';
import { Component } from '../../types/index.js';

export function createUserContainer() {
  const container = new Container();

  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<ReturnModelType<typeof UserEntity>>(Component.UserModel).toConstantValue(UserModel);

  return container;
}

import { ReturnModelType } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { CommentService } from './comment-service.interface.js';
import { DefaultCommentService } from './default-comment.service.js';

export function createCommentContainer() {
  const container = new Container();
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<ReturnModelType<typeof CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  return container;
}

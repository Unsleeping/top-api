import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { ReviewService } from './review.service';
import { ReviewModel } from './review.model';

describe('ReviewService', () => {
  let service: ReviewService;

  const execValue = { exec: jest.fn() };
  const reviewRepositoryFactory = () => ({
    find: () => execValue,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          useFactory: reviewRepositoryFactory,
          provide: getModelToken(ReviewModel.name),
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByProductId is working', async () => {
    const id = new Types.ObjectId().toHexString();

    reviewRepositoryFactory()
      .find()
      .exec.mockReturnValueOnce([{ productId: id }]);

    const res = await service.findByProductId(id);
    expect(res[0].productId).toBe(id);
  });
});

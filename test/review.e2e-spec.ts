import { disconnect, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';
const productId = new Types.ObjectId().toHexString();

// const existed_product_id = '674e23411006608431053041';

const testDto: CreateReviewDto = {
  name: 'John Doe',
  title: 'Test Review',
  description: 'This is a test review.',
  rating: 5,
  productId,
};

const loginDto: AuthDto = {
  login: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    accessToken = body.access_token;
  });

  afterAll(() => {
    disconnect();
  });

  it('/review/create (POST) - success', async () => {
    return await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then((res) => {
        createdId = res.body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/review/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400);
  });

  it('/review/byProduct/:productId (GET) - success', async () => {
    return await request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(1);
      });
  });

  it('/review/byProduct/:productId (GET) - fail', async () => {
    return await request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(0);
      });
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/review/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });
});

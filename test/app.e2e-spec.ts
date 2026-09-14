import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('gestiona inscripciones, cupo y cancelaciones', async () => {
    const servidor = app.getHttpServer();

    await request(servidor)
      .post('/inscripciones')
      .send({ horarioId: 1, miembroId: 1 })
      .expect(201)
      .expect('location', '/inscripciones/1');
    await request(servidor)
      .post('/inscripciones')
      .send({ horarioId: 1, miembroId: 2 })
      .expect(201);
    await request(servidor)
      .post('/inscripciones')
      .send({ horarioId: 1, miembroId: 3 })
      .expect(409);
    await request(servidor)
      .post('/inscripciones')
      .send({ horarioId: 1, miembroId: 1 })
      .expect(409);
    await request(servidor).delete('/inscripciones/1').expect(200);
    await request(servidor)
      .post('/inscripciones')
      .send({ horarioId: 1, miembroId: 3 })
      .expect(201);
    await request(servidor)
      .post('/inscripciones')
      .send({ horarioId: 99, miembroId: 1 })
      .expect(404);
    await request(servidor)
      .post('/inscripciones')
      .send({ horarioId: 1 })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});

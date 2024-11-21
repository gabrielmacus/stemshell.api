import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { testConnectionOptions } from '../../../../../../../app.datasource.testing';
import { User } from './entities/user.entity';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('UserController', () => {
  let controller: UserController;
  let app:INestApplication

  let container:StartedPostgreSqlContainer;
  const saltRounds = 15;

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start();
  },30000);

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(async () => {
    const connOptions: DataSourceOptions = {
      ...testConnectionOptions,
      type:'postgres',
      username: container.getUsername(),
      password: container.getPassword(),
      port:container.getPort(),
      database: container.getDatabase(),
      host: container.getHost()
    };

    const module: TestingModule = await Test.createTestingModule({

      controllers: [UserController],
      imports:[    
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(connOptions),
        TypeOrmModule.forFeature([User])
      ],
      providers: [UserService, UserSubscriber, {
        provide:ConfigService,
        useValue:{
          get:(property:string) => saltRounds
        }
      }],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    controller = module.get<UserController>(UserController);
    const ds = new DataSource(connOptions);
    await ds.initialize();
    await ds.dropDatabase();
    await ds.synchronize();
    await ds.destroy();

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Crea 2 items y los lista sin contraseña', async () => {
    const item1 = {
      username: 'johndoe',
      password: 'caca1234'
    };
    const item2 = {
      username: 'janedoe',
      password: '78910'
    };

    const response = await request(app.getHttpServer())
        .post('/user')
        .send(item1)
        .expect(201);
    //expect(response.b)
    
  });
  
});

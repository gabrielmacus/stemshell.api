import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { TipoInfraccionService } from 'src/features/tipo-infraccion/tipo-infraccion.service';
import { UserPaginationConfig } from './config/user-pagination.config';
import { PostgreSqlContainer, StartedPostgreSqlContainer} from '@testcontainers/postgresql';
import { testConnectionOptions } from '../../../../../../../app.datasource.testing';
import * as bcrypt from 'bcrypt';
import exp from 'constants';

describe('UserService', () => {
  let service: UserService;
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
    })
    .compile();

    service = module.get<UserService>(UserService);
    const ds = new DataSource(connOptions);
    await ds.initialize();
    await ds.dropDatabase();
    await ds.synchronize();
    await ds.destroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('Crea 2 items y los lista con la contraseña hasheada', async () => {
    const item1 = {
      username: 'johndoe',
      password: '123456'
    };
    const item2 = {
      username: 'janedoe',
      password: '78910'
    };

    await service.handleCreate(item1);
    await service.handleCreate(item2);

    const items = await service.handleFindAll({
      path:'/'
    }, UserPaginationConfig);
    
    expect(items.data).toHaveLength(2);
    expect(items.data.at(0)).toHaveProperty("id","1");
    expect(items.data.at(1)).toHaveProperty("id","2");
    expect(items.data.at(0)).not.toHaveProperty("password", '123456');
    expect(items.data.at(1)).not.toHaveProperty("password", '78910');

  });

  it('Elimina el item con id 1 y lista el item no eliminado', async () => {

    const item1 = {
      username: 'johndoe',
      password: '123456'
    };
    const item2 = {
      username: 'janedoe',
      password: '78910'
    };

    await service.handleCreate(item1);
    await service.handleCreate(item2);

    await service.handleRemove(1);

    const items = await service.handleFindAll({
      path:'/'
    }, UserPaginationConfig);
    
    expect(items.data).toHaveLength(1);
    expect(items.data.at(0)).toHaveProperty("id","2")

  });

  it('Cambia los datos del item con id 2', async () => {

    const item1 = {
      username: 'johndoe',
      password: '123456'
    };
    const item2 = {
      username: 'janedoe',
      password: '78910'
    };

    await service.handleCreate(item1);
    const originalItem2 = await service.handleCreate(item2);

    await service.handleUpdate(2, {
      username:"jane_doe"
    });

    const items = await service.handleFindAll({
      path:'/'
    }, UserPaginationConfig);
    
    expect(items.data.at(1)).toHaveProperty("username","jane_doe")
    expect(items.data.at(1)).toHaveProperty("password", originalItem2.password)

  });


  it('Intenta crear un usuario con un nombre de usuario ya utilizado y da error', async () => {
    await service.handleCreate({
      username: 'janedoe',
      password: '78910'
    });
    await expect(service.handleCreate({
      username:'janedoe',
      password:'1111111'
    })).rejects.toThrow(QueryFailedError);
    
  })


  it("Hashea una contraseña", async () => {
    const password = '123456';
    await service.hashPassword(password);
    bcrypt.hash(password, saltRounds)
  });
  
});

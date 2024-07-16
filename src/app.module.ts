import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';

// import Book from './modules/book/book.entity';
// import BookModule from './modules/book/book.module';

@Module({
  imports: [
    //ConfigModule: It simplifies loading and accessing configuration values, particularly from environment variables.
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT, 10) || 5432,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,
    //   schema: process.env.DB_SCHEMA,
    //   entities: [
    //     User,
    //     // Book
    //   ],

    //   synchronize: true,
    // }),

    MongooseModule.forRoot(process.env.MONGODB_URI),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('MONGODB_URI'),
        entities: [User],
        synchronize: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    // BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

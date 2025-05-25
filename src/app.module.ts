import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'//db postgres orm
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/Transactions.module';
import { WalletsModule } from './wallets/Wallets.module';
import { BinanceModule } from './servicesApi/binance/binance.module'
import { NotificationsModule } from './notifications/notifications.module';
import { User } from './model/user.entity';
import { Wallet } from './model/wallet.entity';
import { Transaction } from './model/transaction.entity';
import { MercadoPagoModule } from './servicesApi/serviceMP/mercadoPago.module';


@Module({
  imports: [
    //conexion a postgreSql
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'Alma2022',//crear
      password: 'Alma2022',//crear
      database: 'converter',//crear
      entities: [User],
      autoLoadEntities: true,
      synchronize: true, // Solo en desarrollo
    }),
    TypeOrmModule.forFeature([User, Wallet, Transaction]),
    TasksModule,
    ProjectsModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    WalletsModule,
    BinanceModule,
    NotificationsModule,
    MercadoPagoModule
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'//db postgres orm
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { WalletModule } from './wallet/wallet.module';
import { UsdtModule } from './usdt/usdt.module';
import { ExchangeModule } from './exchange/exchange.module';
import { BinanceModule } from './servicesApi/binance.module';

@Module({
  imports: [
    //conexion a postgreSql
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',//crear
    //   password: 'tu_password',//crear
    //   database: 'nombre_de_tu_bd',//crear
    //   autoLoadEntities: true,
    //   synchronize: true, // Solo en desarrollo
    // }),
    TasksModule,
    ProjectsModule,
    AuthModule,
    UsersModule,
    PaymentsModule,
    WalletModule,
    UsdtModule,
    ExchangeModule,
    BinanceModule
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}

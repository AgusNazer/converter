import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { WalletModule } from './wallet/wallet.module';
import { UsdtModule } from './usdt/usdt.module';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [TasksModule, ProjectsModule, AuthModule, UsersModule, PaymentsModule, WalletModule, UsdtModule, ExchangeModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}

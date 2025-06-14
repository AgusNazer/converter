import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';



async function bootstrap() {
dotenv.config();
 
  const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
                .setTitle('Converter API')
                .setDescription('CRUD+Converter money')
                .setVersion('1.0')
                .addTag('converter')
                .build();
  const documentFactory = ()=> SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory)

    app.enableCors({
    origin: 'http://localhost:3001', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();

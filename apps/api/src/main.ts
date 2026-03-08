import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('CloudNotes API')
    .setDescription('API para gerenciamento de notas com autenticação AWS Cognito')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticação via AWS Cognito')
    .addTag('Notes', 'Gerenciamento de notas')
    .addTag('Users', 'Gerenciamento de perfil do usuário')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 5001)
  console.log(`🚀 API rodando em http://localhost:${process.env.PORT ?? 5001}`)
  console.log(`📚 Swagger disponível em http://localhost:${process.env.PORT ?? 5001}/api`)
}
bootstrap()

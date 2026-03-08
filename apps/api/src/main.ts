import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { LoggerService } from './common/logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const logger = app.get(LoggerService)

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

  app.useGlobalFilters(new AllExceptionsFilter(logger))

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

  const port = process.env.PORT ?? 5001
  await app.listen(port)
  
  console.log(`🚀 API rodando em http://localhost:${port}`)
  console.log(`📚 Swagger disponível em http://localhost:${port}/api`)
}
bootstrap()

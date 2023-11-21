import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Boolestation")
    .setDescription("Server application of Boolestation")
    .setVersion("1.0")
    .addTag("authentication")
    .addTag("alternatives")
    .addTag("exercises")
    .addTag("lessons")
    .addTag("level-states")
    .addTag("modules")
    .addTag("profile-pictures")
    .addTag("users")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
bootstrap();

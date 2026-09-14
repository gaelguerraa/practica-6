import { Module } from '@nestjs/common';
import { ClasesController } from './clases.controller.js';
import { ClasesService } from './clases.service.js';

@Module({
  controllers: [ClasesController],
  providers: [ClasesService],
})
export class ClasesModule {}

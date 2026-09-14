import { Module } from '@nestjs/common';
import { InscripcionesController } from './inscripciones.controller.js';
import { InscripcionesService } from './inscripciones.service.js';
import { INSCRIPCION_REPOSITORY } from '../CodigoBase/inscripciones/dominio/inscripcion.repository.js';
import { InscripcionMemoriaRepository } from '../CodigoBase/inscripciones/infra/inscripcion-memoria.repository.js';

@Module({
  controllers: [InscripcionesController],
  providers: [
    InscripcionesService,
    {
      provide: INSCRIPCION_REPOSITORY,
      useClass: InscripcionMemoriaRepository,
    },
  ],
})
export class InscripcionesModule {}

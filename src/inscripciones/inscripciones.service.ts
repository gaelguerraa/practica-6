import { Inject, Injectable } from '@nestjs/common';
import {
  CupoLlenoError,
  HorarioNoEncontradoError,
  InscripcionDuplicadaError,
  InscripcionNoEncontradaError,
  MiembroNoEncontradoError,
} from '../CodigoBase/inscripciones/dominio/errores.js';
import type { Inscripcion } from '../CodigoBase/inscripciones/dominio/entidades.js';
import { INSCRIPCION_REPOSITORY } from '../CodigoBase/inscripciones/dominio/inscripcion.repository.js';
import type { InscripcionRepository } from '../CodigoBase/inscripciones/dominio/inscripcion.repository.js';
import type { CrearInscripcionDto } from '../CodigoBase/inscripciones/dto/crear-inscripcion.dto.js';

@Injectable()
export class InscripcionesService {
  constructor(
    @Inject(INSCRIPCION_REPOSITORY)
    private readonly repositorio: InscripcionRepository,
  ) {}

  listar(): Promise<Inscripcion[]> {
    return this.repositorio.listar();
  }

  async crear(datos: CrearInscripcionDto): Promise<Inscripcion> {
    const horario = await this.repositorio.buscarHorario(datos.horarioId);
    if (!horario) throw new HorarioNoEncontradoError(datos.horarioId);

    const miembro = await this.repositorio.buscarMiembro(datos.miembroId);
    if (!miembro) throw new MiembroNoEncontradoError(datos.miembroId);

    const inscripciones = await this.repositorio.buscarPorHorario(
      datos.horarioId,
    );
    const confirmadas = inscripciones.filter((i) => i.estado === 'confirmada');
    if (confirmadas.some((i) => i.miembroId === datos.miembroId)) {
      throw new InscripcionDuplicadaError(datos.horarioId, datos.miembroId);
    }
    if (confirmadas.length >= horario.cupoMaximo) {
      throw new CupoLlenoError(datos.horarioId, horario.cupoMaximo);
    }

    return this.repositorio.guardar(datos);
  }

  async cancelar(id: number): Promise<Inscripcion> {
    const inscripcion = await this.repositorio.cancelar(id);
    if (!inscripcion) throw new InscripcionNoEncontradaError(id);
    return inscripcion;
  }
}

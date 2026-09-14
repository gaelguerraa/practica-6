import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  CupoLlenoError,
  HorarioNoEncontradoError,
  InscripcionDuplicadaError,
  InscripcionNoEncontradaError,
  MiembroNoEncontradoError,
} from '../CodigoBase/inscripciones/dominio/errores.js';
import type { CrearInscripcionDto } from '../CodigoBase/inscripciones/dto/crear-inscripcion.dto.js';
import { aInscripcionDto } from '../CodigoBase/inscripciones/dto/inscripcion-respuesta.dto.js';
import type { InscripcionResponseDto } from '../CodigoBase/inscripciones/dto/inscripcion-respuesta.dto.js';
import { InscripcionesService } from './inscripciones.service.js';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Get()
  async listar(): Promise<InscripcionResponseDto[]> {
    return (await this.inscripcionesService.listar()).map(aInscripcionDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(
    @Body() cuerpo: CrearInscripcionDto,
    @Res({ passthrough: true }) respuesta: Response,
  ): Promise<InscripcionResponseDto> {
    this.validarCreacion(cuerpo);
    try {
      const inscripcion = await this.inscripcionesService.crear(cuerpo);
      respuesta.location(`/inscripciones/${inscripcion.id}`);
      return aInscripcionDto(inscripcion);
    } catch (error) {
      this.traducirError(error);
    }
  }

  @Delete(':id')
  async cancelar(
    @Param('id') idTexto: string,
  ): Promise<InscripcionResponseDto> {
    const id = Number(idTexto);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('El id debe ser un entero positivo');
    }
    try {
      return aInscripcionDto(await this.inscripcionesService.cancelar(id));
    } catch (error) {
      this.traducirError(error);
    }
  }

  private validarCreacion(cuerpo: CrearInscripcionDto): void {
    if (
      !cuerpo ||
      !Number.isInteger(cuerpo.horarioId) ||
      !Number.isInteger(cuerpo.miembroId) ||
      cuerpo.horarioId <= 0 ||
      cuerpo.miembroId <= 0
    ) {
      throw new BadRequestException(
        'horarioId y miembroId son obligatorios y deben ser enteros positivos',
      );
    }
  }

  private traducirError(error: unknown): never {
    if (
      error instanceof HorarioNoEncontradoError ||
      error instanceof MiembroNoEncontradoError ||
      error instanceof InscripcionNoEncontradaError
    ) {
      throw new NotFoundException(error.message);
    }
    if (
      error instanceof CupoLlenoError ||
      error instanceof InscripcionDuplicadaError
    ) {
      throw new ConflictException(error.message);
    }
    throw error;
  }
}

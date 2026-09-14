import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClasesService } from './clases.service.js';
import type { Clase } from './clases.service.js';

@Controller('clases')
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  @Get()
  listar(): Clase[] {
    return this.clasesService.listar();
  }

  @Post()
  crear(@Body() cuerpo: { nombre: string }): Clase {
    return this.clasesService.crear(cuerpo.nombre);
  }
}

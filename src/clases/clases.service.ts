import { Injectable } from '@nestjs/common';

export interface Clase {
  id: number;
  nombre: string;
}

@Injectable()
export class ClasesService {
  private readonly clases: Clase[] = [
    { id: 1, nombre: 'Yoga' },
    { id: 2, nombre: 'Pilates' },
    { id: 3, nombre: 'Spinning' },
  ];

  listar(): Clase[] {
    return this.clases;
  }

  crear(nombre: string): Clase {
    const clase = { id: this.clases.length + 1, nombre };
    this.clases.push(clase);
    return clase;
  }
}

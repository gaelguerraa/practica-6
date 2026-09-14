Respuestas

¿Qué pasaría si el módulo no quedara registrado en la raíz? Nest no incorporaría ese módulo al grafo de la aplicación: sus controladores no publicarían rutas (por ejemplo, GET /clases respondería 404) y sus proveedores no estarían disponibles en el contexto de la aplicación. La importación en AppModule evita ese problema. 

¿Por qué los métodos del repositorio devuelven promesas si los datos van a estar en memoria? El contrato se diseña para el caso asíncrono más lento (base de datos, red o disco). Así, el servicio puede usar await hoy y reemplazar la implementación en memoria sin modificar su lógica ni la interfaz. 

¿Qué error apareció al cambiar a la interfaz, y por qué la clase sí se había resuelto sola? Nest reportaría que no puede resolver la dependencia del servicio porque una interfaz de TypeScript se elimina en tiempo de ejecución y no puede ser un token de DI. Una clase concreta sí existe en tiempo de ejecución, puede leerse desde los metadatos del constructor y actúa como su propio token/proveedor. El símbolo exportado y @Inject() aportan un identificador disponible en runtime. 

¿Por qué el servicio necesita un token para el repositorio, pero el controlador no lo necesita para el servicio? El controlador depende de InscripcionesService, que es una clase concreta existente en runtime y registrada como proveedor. En cambio, InscripcionRepository es una interfaz, desaparece al compilar y requiere el token explícito para asociarla con InscripcionMemoriaRepository. 

¿Cuál es la diferencia entre un 400 y un 409? 400 Bad Request indica que la petición es inválida antes de aplicar el negocio, como faltar campos obligatorios o enviar IDs no enteros positivos. 409 Conflict indica que una petición bien formada contradice el estado o las reglas actuales del gimnasio, como cupo lleno o miembro repetido. 

¿Por qué cambió el código de estado de la última petición? Inicialmente el horario tenía sus dos plazas confirmadas, por lo que la creación devolvía 409. Al cancelar la inscripción 1, deja de contarse entre las confirmadas; por ello el miembro 3 puede ocupar la plaza liberada y la misma solicitud pasa a devolver 201. 

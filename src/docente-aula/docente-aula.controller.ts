import { Body, Controller, Delete, Get, Param, Patch, Post, ParseUUIDPipe } from '@nestjs/common';
import { DocenteAulaService } from './docente-aula.service';
import { CreateDocenteAulaDto } from './dto/create-docente-aula.dto';
import { UpdateDocenteAulaDto } from './dto/update-docente-aula.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocenteAula } from './entities/docente-aula.entity';
@ApiTags('Docente Aula')
@Controller('docente-aula')
export class DocenteAulaController {
    constructor(private readonly docenteAulaService: DocenteAulaService) { }

    @Post()
    @ApiResponse({ status: 201, description: 'DocenteAula was created', type: DocenteAula })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
    create(@Body() createDocenteAulaDto: CreateDocenteAulaDto) {
        return this.docenteAulaService.create(createDocenteAulaDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
    findAll() {
        return this.docenteAulaService.findAll();
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
    @ApiResponse({ status: 404, description: 'Not Found' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.docenteAulaService.findOne(id);
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
    @ApiResponse({ status: 404, description: 'Not Found' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDocenteAulaDto: UpdateDocenteAulaDto,
    ) {
        return this.docenteAulaService.update(id, updateDocenteAulaDto);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
    @ApiResponse({ status: 404, description: 'Not Found' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.docenteAulaService.remove(id);
    }
}

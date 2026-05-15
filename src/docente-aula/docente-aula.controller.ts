import { Body, Controller, Delete, Get, Param, Patch, Post, ParseUUIDPipe } from '@nestjs/common';
import { DocenteAulaService } from './docente-aula.service';
import { CreateDocenteAulaDto } from './dto/create-docente-aula.dto';
import { UpdateDocenteAulaDto } from './dto/update-docente-aula.dto';

@Controller('docente-aula')
export class DocenteAulaController {
    constructor(private readonly docenteAulaService: DocenteAulaService) { }

    @Post()
    create(@Body() createDocenteAulaDto: CreateDocenteAulaDto) {
        return this.docenteAulaService.create(createDocenteAulaDto);
    }

    @Get()
    findAll() {
        return this.docenteAulaService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.docenteAulaService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDocenteAulaDto: UpdateDocenteAulaDto,
    ) {
        return this.docenteAulaService.update(id, updateDocenteAulaDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.docenteAulaService.remove(id);
    }
}

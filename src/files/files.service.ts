import { existsSync } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';


@Injectable()
export class FilesService {
    getStaticFileImage(imageName: string) {

        const path = join(process.cwd(), 'static/uploads', imageName);

        if (!existsSync(path))
            throw new BadRequestException(`No product found with image ${imageName}`);

        return path;
    }


}

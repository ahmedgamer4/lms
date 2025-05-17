import { Module } from '@nestjs/common';
import { CourseCodesService } from './course-codes.service';
import { CourseCodesController } from './course-codes.controller';

@Module({
  controllers: [CourseCodesController],
  providers: [CourseCodesService],
})
export class CourseCodesModule {}

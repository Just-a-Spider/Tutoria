import { Test, TestingModule } from '@nestjs/testing';
import { StudentProfileController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

describe('ProfilesController', () => {
  let controller: StudentProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentProfileController],
      providers: [ProfilesService],
    }).compile();

    controller = module.get<StudentProfileController>(StudentProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

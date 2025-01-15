import { getStaticUrl } from '@/utils/static-url.util';
import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { StudentProfileDto, TutorProfileDto } from './dto/profiles.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('Profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('student')
  @ApiOperation({ summary: 'Get the student profile' })
  @ApiResponse({ status: 200, description: 'Return the student profile' })
  async getStudentProfile(@Req() req) {
    const userId = req.user.id;
    const profile = await this.profilesService.getBothProfiles(
      userId,
      'student',
    );
    const profileDto: StudentProfileDto = {
      profile_picture: getStaticUrl(profile.studentProfile.profile_picture),
    };
    return profileDto;
  }

  @Get('tutor')
  @ApiOperation({ summary: 'Get the tutor profile' })
  @ApiResponse({ status: 200, description: 'Return the tutor profile' })
  async getTutorProfile(@Req() req) {
    const userId = req.user.id;
    const profile = await this.profilesService.getBothProfiles(userId, 'tutor');
    const profileDto: TutorProfileDto = {
      profile_picture: getStaticUrl(profile.tutorProfile.profile_picture),
      bio: profile.tutorProfile.bio,
      rating: profile.tutorProfile.rating,
      helped: profile.tutorProfile.helped,
    };
    return profileDto;
  }

  @Post(':mode/upload-profile-picture')
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiResponse({
    status: 201,
    description: 'Profile picture uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid file type' })
  @ApiParam({
    name: 'mode',
    enum: ['student', 'tutor'],
    description: 'Mode of the profile (student or tutor)',
  })
  @UseInterceptors(
    FileInterceptor('profile_picture', {
      storage: diskStorage({
        destination: './uploads/profile_pictures',
        filename: (req, file, cb) => {
          // Set the filename to be exactly the name of the uploaded file, no suffix
          cb(null, `${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadProfilePicture(
    @Req() req,
    @Param('mode') mode: 'student' | 'tutor',
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const filePath = await this.profilesService.updateProfilePicture(
      userId,
      file,
      mode,
    );
    return {
      message: 'File uploaded successfully!',
      filePath,
    };
  }
}

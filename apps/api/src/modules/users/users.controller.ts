import { Controller, Get, Patch, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any).userId;
    const dbType = process.env.DB_TYPE || 'nosql';

    if (dbType === 'sql') {
      const user = await this.usersService['sqlRepo'].findByCognitoId(userId);
      return { success: true, data: user };
    }

    const user = await this.usersService['nosqlRepo'].findByCognitoId(userId);
    return { success: true, data: user };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const userId = (req.user as any).userId;
    const dbType = process.env.DB_TYPE || 'nosql';

    if (dbType === 'both') {
      const [sqlUser, nosqlUser] = await Promise.all([
        this.usersService['sqlRepo'].update(userId, dto),
        this.usersService['nosqlRepo'].update(userId, dto),
      ]);
      return { success: true, data: { sql: sqlUser, nosql: nosqlUser } };
    }

    if (dbType === 'sql') {
      const user = await this.usersService['sqlRepo'].update(userId, dto);
      return { success: true, data: user };
    }

    const user = await this.usersService['nosqlRepo'].update(userId, dto);
    return { success: true, data: user };
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user account' })
  async deleteAccount(@Req() req: Request) {
    const userId = (req.user as any).userId;
    const dbType = process.env.DB_TYPE || 'nosql';

    if (dbType === 'both') {
      await Promise.all([
        this.usersService['sqlRepo'].delete(userId),
        this.usersService['nosqlRepo'].delete(userId),
      ]);
      return { success: true, message: 'User deleted successfully' };
    }

    if (dbType === 'sql') {
      await this.usersService['sqlRepo'].delete(userId);
      return { success: true, message: 'User deleted successfully' };
    }

    await this.usersService['nosqlRepo'].delete(userId);
    return { success: true, message: 'User deleted successfully' };
  }
}

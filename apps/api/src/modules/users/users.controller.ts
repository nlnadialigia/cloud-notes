import { Controller, Get, Patch, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CognitoService } from '../auth/cognito.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cognitoService: CognitoService,
  ) {}

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

  @Patch('me/password')
  @ApiOperation({ summary: 'Update current user password' })
  async updatePassword(@Req() req: Request, @Body() dto: { currentPassword: string; newPassword: string }) {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    await this.cognitoService.changePassword(accessToken, dto.currentPassword, dto.newPassword);
    return { success: true, message: 'Password updated successfully' };
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user account' })
  async deleteAccount(@Req() req: Request) {
    const userId = (req.user as any).userId;
    const email = (req.user as any).email;
    const dbType = process.env.DB_TYPE || 'nosql';

    // Delete from database
    if (dbType === 'both') {
      await Promise.all([
        this.usersService['sqlRepo'].delete(userId),
        this.usersService['nosqlRepo'].delete(userId),
      ]);
    } else if (dbType === 'sql') {
      await this.usersService['sqlRepo'].delete(userId);
    } else {
      await this.usersService['nosqlRepo'].delete(userId);
    }

    // Delete from Cognito
    await this.cognitoService.deleteUser(email);

    return { success: true, message: 'User deleted successfully' };
  }
}

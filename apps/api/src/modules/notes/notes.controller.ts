import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { NotesSqlService } from './notes-sql.service'
import { NotesNoSqlService } from './notes-nosql.service'
import { CreateNoteDto } from './dto/create-note.dto'
import { UpdateNoteDto } from './dto/update-note.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import type { Request } from 'express'

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(
    private notesSqlService: NotesSqlService,
    private notesNoSqlService: NotesNoSqlService,
  ) {}

  private getDbType() {
    return process.env.DB_TYPE || 'nosql'
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  async create(@Req() req: Request, @Body() dto: CreateNoteDto) {
    const userId = (req.user as any).userId
    const dbType = this.getDbType()

    if (dbType === 'both') {
      const [sqlNote, nosqlNote] = await Promise.all([
        this.notesSqlService.create(userId, dto.title, dto.content),
        this.notesNoSqlService.create(userId, dto.title, dto.content),
      ])
      return { success: true, data: { sql: sqlNote, nosql: nosqlNote } }
    }

    const note =
      dbType === 'sql'
        ? await this.notesSqlService.create(userId, dto.title, dto.content)
        : await this.notesNoSqlService.create(userId, dto.title, dto.content)

    return { success: true, data: note }
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  async findAll(@Req() req: Request, @Query('status') status?: string) {
    const userId = (req.user as any).userId
    const dbType = this.getDbType()

    if (dbType === 'both') {
      const [sqlNotes, nosqlNotes] = await Promise.all([
        this.notesSqlService.findAll(userId, status),
        this.notesNoSqlService.findAll(userId, status),
      ])
      return { success: true, data: { sql: sqlNotes, nosql: nosqlNotes } }
    }

    const notes =
      dbType === 'sql'
        ? await this.notesSqlService.findAll(userId, status)
        : await this.notesNoSqlService.findAll(userId, status)

    return { success: true, data: notes }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get note by ID' })
  async findOne(@Req() req: Request, @Param('id') noteId: string) {
    const userId = (req.user as any).userId
    const dbType = this.getDbType()

    if (dbType === 'both') {
      const [sqlNote, nosqlNote] = await Promise.all([
        this.notesSqlService.findOne(userId, noteId),
        this.notesNoSqlService.findOne(userId, noteId),
      ])
      return { success: true, data: { sql: sqlNote, nosql: nosqlNote } }
    }

    const note =
      dbType === 'sql'
        ? await this.notesSqlService.findOne(userId, noteId)
        : await this.notesNoSqlService.findOne(userId, noteId)

    return { success: true, data: note }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update note' })
  async update(@Req() req: Request, @Param('id') noteId: string, @Body() dto: UpdateNoteDto) {
    const userId = (req.user as any).userId
    const dbType = this.getDbType()

    if (dbType === 'both') {
      const [sqlNote, nosqlNote] = await Promise.all([
        this.notesSqlService.update(userId, noteId, dto),
        this.notesNoSqlService.update(userId, noteId, dto),
      ])
      return { success: true, data: { sql: sqlNote, nosql: nosqlNote } }
    }

    const note =
      dbType === 'sql'
        ? await this.notesSqlService.update(userId, noteId, dto)
        : await this.notesNoSqlService.update(userId, noteId, dto)

    return { success: true, data: note }
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive note' })
  async archive(@Req() req: Request, @Param('id') noteId: string) {
    const userId = (req.user as any).userId
    const dbType = this.getDbType()

    if (dbType === 'both') {
      const [sqlNote, nosqlNote] = await Promise.all([
        this.notesSqlService.archive(userId, noteId),
        this.notesNoSqlService.archive(userId, noteId),
      ])
      return { success: true, data: { sql: sqlNote, nosql: nosqlNote } }
    }

    const note =
      dbType === 'sql'
        ? await this.notesSqlService.archive(userId, noteId)
        : await this.notesNoSqlService.archive(userId, noteId)

    return { success: true, data: note }
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive note' })
  async unarchive(@Req() req: Request, @Param('id') noteId: string) {
    const userId = (req.user as any).userId
    const dbType = this.getDbType()

    if (dbType === 'both') {
      const [sqlNote, nosqlNote] = await Promise.all([
        this.notesSqlService.unarchive(userId, noteId),
        this.notesNoSqlService.unarchive(userId, noteId),
      ])
      return { success: true, data: { sql: sqlNote, nosql: nosqlNote } }
    }

    const note =
      dbType === 'sql'
        ? await this.notesSqlService.unarchive(userId, noteId)
        : await this.notesNoSqlService.unarchive(userId, noteId)

    return { success: true, data: note }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete note' })
  async delete(@Req() req: Request, @Param('id') noteId: string) {
    const userId = (req.user as any).userId
    const dbType = this.getDbType()

    if (dbType === 'both') {
      await Promise.all([this.notesSqlService.delete(userId, noteId), this.notesNoSqlService.delete(userId, noteId)])
      return { success: true, message: 'Note deleted from both databases' }
    }

    dbType === 'sql'
      ? await this.notesSqlService.delete(userId, noteId)
      : await this.notesNoSqlService.delete(userId, noteId)

    return { success: true, message: 'Note deleted successfully' }
  }
}

export type NoteStatus = 'active' | 'archived';

export interface Note {
  noteId: string;
  userId: string;
  title: string;
  content: string;
  status: NoteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  status?: NoteStatus;
}

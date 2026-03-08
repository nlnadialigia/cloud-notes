import { apiClient } from '../api';
import { Note } from '../types';

interface CreateNoteData {
  title: string;
  content: string;
}

interface UpdateNoteData {
  title?: string;
  content?: string;
}

export const notesService = {
  async getNotes(status?: 'active' | 'archived'): Promise<Note[]> {
    const query = status ? `?status=${status}` : '';
    return apiClient<Note[]>(`/notes${query}`);
  },

  async getNote(id: string): Promise<Note> {
    return apiClient<Note>(`/notes/${id}`);
  },

  async createNote(data: CreateNoteData): Promise<Note> {
    return apiClient<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateNote(id: string, data: UpdateNoteData): Promise<Note> {
    return apiClient<Note>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteNote(id: string): Promise<void> {
    return apiClient<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },

  async archiveNote(id: string): Promise<Note> {
    return apiClient<Note>(`/notes/${id}/archive`, {
      method: 'PATCH',
    });
  },

  async unarchiveNote(id: string): Promise<Note> {
    return apiClient<Note>(`/notes/${id}/unarchive`, {
      method: 'PATCH',
    });
  },
};

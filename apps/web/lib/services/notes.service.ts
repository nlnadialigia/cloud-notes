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
    const response = await apiClient<{ data: Note[] }>(`/notes${query}`);
    return response.data;
  },

  async getNote(id: string): Promise<Note> {
    const response = await apiClient<{ data: Note }>(`/notes/${id}`);
    return response.data;
  },

  async createNote(data: CreateNoteData): Promise<Note> {
    const response = await apiClient<{ data: Note }>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateNote(id: string, data: UpdateNoteData): Promise<Note> {
    const response = await apiClient<{ data: Note }>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await apiClient<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },

  async archiveNote(id: string): Promise<Note> {
    const response = await apiClient<{ data: Note }>(`/notes/${id}/archive`, {
      method: 'PATCH',
    });
    return response.data;
  },

  async unarchiveNote(id: string): Promise<Note> {
    const response = await apiClient<{ data: Note }>(`/notes/${id}/unarchive`, {
      method: 'PATCH',
    });
    return response.data;
  },
};

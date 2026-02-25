// src/api/services/fileService.js
import { uploadApi, api } from '../axios';
import { API_ENDPOINTS } from './config';

export const fileService = {
  upload: (file) => {
    const fd = new FormData();
    fd.append('file', file);

    return uploadApi.post(API_ENDPOINTS.FILE.UPLOAD, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  remove: (fileId) => api.delete(API_ENDPOINTS.FILE.DELETE(fileId)),
};

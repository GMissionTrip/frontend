import { archiveService } from '@/services/archiveService';
import api from '@/api/axiosInstance';

// Mock axios
jest.mock('@/api/axiosInstance', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('Services Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ArchiveService', () => {
    describe('getArchives', () => {
      it('should return archives when API call succeeds', async () => {
        const mockArchives = [
          {
            id: 1,
            title: 'Test Trip 1',
            date: '2024-01-01 - 2024-01-03',
            location: 'Test Location 1',
            background: 'test-bg-1.jpg',
            isImage: true,
            description: 'Test description 1',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-03'
          },
          {
            id: 2,
            title: 'Test Trip 2',
            date: '2024-02-01 - 2024-02-03',
            location: 'Test Location 2',
            background: 'test-bg-2.jpg',
            isImage: true,
            description: 'Test description 2',
            createdAt: '2024-02-01',
            updatedAt: '2024-02-03'
          }
        ];

        mockApi.get.mockResolvedValue({
          data: { data: mockArchives }
        });

        const result = await archiveService.getArchives();

        expect(mockApi.get).toHaveBeenCalledWith('/api/test/archives');
        expect(result).toEqual(mockArchives);
      });

      it('should return dummy data when API call fails', async () => {
        mockApi.get.mockRejectedValue(new Error('API Error'));

        const result = await archiveService.getArchives();

        expect(result).toHaveLength(5);
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('title');
        expect(result[0]).toHaveProperty('date');
        expect(result[0]).toHaveProperty('location');
        expect(result[0]).toHaveProperty('background');
      });

      it('should return empty array when API returns no data', async () => {
        mockApi.get.mockResolvedValue({
          data: { data: null }
        });

        const result = await archiveService.getArchives();

        expect(result).toEqual([]);
      });
    });

    describe('getArchiveDetail', () => {
      it('should return archive detail when API call succeeds', async () => {
        const mockArchiveDetail = {
          id: 1,
          title: 'Test Trip Detail',
          date: '2024-01-01 - 2024-01-03',
          location: 'Test Location',
          background: 'test-bg.jpg',
          isImage: true,
          description: 'Test description',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-03',
          missions: [
            {
              id: '1',
              time: '10:00',
              title: 'Mission 1',
              place: 'Place 1',
              img: 'mission1.jpg',
              description: 'Mission 1 description',
              order: 1
            }
          ],
          photos: []
        };

        mockApi.get.mockResolvedValue({
          data: { data: mockArchiveDetail }
        });

        const result = await archiveService.getArchiveDetail(1);

        expect(mockApi.get).toHaveBeenCalledWith('/api/test/archives/detail', {
          params: { archiveId: 1 }
        });
        expect(result).toEqual(mockArchiveDetail);
      });

      it('should return dummy archive detail when API call fails', async () => {
        mockApi.get.mockRejectedValue(new Error('API Error'));

        const result = await archiveService.getArchiveDetail(1);

        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('missions');
        expect(result).toHaveProperty('photos');
        expect(Array.isArray(result.missions)).toBe(true);
        expect(Array.isArray(result.photos)).toBe(true);
      });
    });

    describe('createArchive', () => {
      it('should create archive when API call succeeds', async () => {
        const mockArchiveData = {
          title: 'New Trip',
          date: '2024-03-01 - 2024-03-03',
          location: 'New Location',
          background: 'new-bg.jpg',
          isImage: true,
          description: 'New description'
        };

        const mockCreatedArchive = {
          id: 3,
          ...mockArchiveData,
          createdAt: '2024-03-01',
          updatedAt: '2024-03-01'
        };

        mockApi.post.mockResolvedValue({
          data: { data: mockCreatedArchive }
        });

        const result = await archiveService.createArchive(mockArchiveData);

        expect(mockApi.post).toHaveBeenCalledWith('/api/test/archives', mockArchiveData);
        expect(result).toEqual(mockCreatedArchive);
      });

      it('should throw error when API call fails', async () => {
        mockApi.post.mockRejectedValue(new Error('API Error'));

        const mockArchiveData = {
          title: 'New Trip',
          date: '2024-03-01 - 2024-03-03',
          location: 'New Location',
          background: 'new-bg.jpg',
          isImage: true,
          description: 'New description'
        };

        await expect(archiveService.createArchive(mockArchiveData)).rejects.toThrow('API Error');
      });
    });

    describe('updateArchive', () => {
      it('should update archive when API call succeeds', async () => {
        const mockUpdateData = {
          title: 'Updated Trip',
          description: 'Updated description'
        };

        const mockUpdatedArchive = {
          id: 1,
          title: 'Updated Trip',
          date: '2024-01-01 - 2024-01-03',
          location: 'Test Location',
          background: 'test-bg.jpg',
          isImage: true,
          description: 'Updated description',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-03'
        };

        mockApi.put.mockResolvedValue({
          data: { data: mockUpdatedArchive }
        });

        const result = await archiveService.updateArchive(1, mockUpdateData);

        expect(mockApi.put).toHaveBeenCalledWith('/api/test/archives/1', mockUpdateData);
        expect(result).toEqual(mockUpdatedArchive);
      });

      it('should throw error when API call fails', async () => {
        mockApi.put.mockRejectedValue(new Error('API Error'));

        const mockUpdateData = {
          title: 'Updated Trip'
        };

        await expect(archiveService.updateArchive(1, mockUpdateData)).rejects.toThrow('API Error');
      });
    });

    describe('deleteArchive', () => {
      it('should delete archive when API call succeeds', async () => {
        mockApi.delete.mockResolvedValue({
          data: { message: 'Archive deleted successfully' }
        });

        await archiveService.deleteArchive(1);

        expect(mockApi.delete).toHaveBeenCalledWith('/api/test/archives/1');
      });

      it('should throw error when API call fails', async () => {
        mockApi.delete.mockRejectedValue(new Error('API Error'));

        await expect(archiveService.deleteArchive(1)).rejects.toThrow('API Error');
      });
    });
  });
});

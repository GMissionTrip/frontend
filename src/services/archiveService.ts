import api from "@/api/axiosInstance";

export interface Archive {
  id: number;
  title: string;
  date: string;
  location: string;
  background: string;
  isImage?: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchiveDetail extends Archive {
  missions: Mission[];
  photos: Photo[];
}

export interface Mission {
  id: string;
  time: string;
  title: string;
  place: string;
  img?: string;
  description?: string;
  order: number;
}

export interface Photo {
  id: string;
  url: string;
  missionId: string;
  order: number;
}

class ArchiveService {
  private baseURL = "/api/archives"; // 실제 API 사용

  // 사용자의 모든 아카이브 조회
  async getArchives(): Promise<Archive[]> {
    // 임시로 더미 데이터만 사용 (백엔드 연결 문제 해결 전까지)
    console.log("데모 모드: 더미 데이터를 사용합니다.");
    return this.getDummyArchives();
    
    // 백엔드 연결이 정상화되면 아래 코드를 사용
    /*
    try {
      const response = await api.get(this.baseURL);
      return response.data.data || [];
    } catch (error) {
      
      console.log("더미 데이터를 사용합니다.");
      return this.getDummyArchives();
    }
    */
  }

  // 더미 데이터 반환
  private getDummyArchives(): Archive[] {
    return [
      {
        id: 1,
        title: "가평의 여름!",
        date: "2024-06-28 - 2024-06-30",
        location: "힐링 (바다여행)",
        background: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400&h=300&fit=crop",
        isImage: true,
        description: "힐링 테마의 바다여행입니다.",
        createdAt: "2024-06-25",
        updatedAt: "2024-06-30"
      },
      {
        id: 2,
        title: "속초의 가을!",
        date: "2024-05-01 - 2024-05-03",
        location: "액티비티 (서핑)",
        background: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isImage: true,
        description: "액티비티 테마의 서핑 여행입니다.",
        createdAt: "2024-04-28",
        updatedAt: "2024-05-03"
      },
      {
        id: 3,
        title: "부산의 봄!",
        date: "2024-04-10 - 2024-04-12",
        location: "맛집탐방 (해산물)",
        background: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400&h=300&fit=crop",
        isImage: true,
        description: "맛집탐방 테마의 해산물 여행입니다.",
        createdAt: "2024-04-08",
        updatedAt: "2024-04-12"
      },
      {
        id: 4,
        title: "강릉 카페거리 탐방",
        date: "2024-07-15 - 2024-07-17",
        location: "힐링 (카페투어)",
        background: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isImage: true,
        description: "힐링 테마의 카페투어입니다.",
        createdAt: "2024-07-12",
        updatedAt: "2024-07-17"
      },
      {
        id: 5,
        title: "설악산 등반기",
        date: "2024-06-01 - 2024-06-03",
        location: "액티비티 (등산)",
        background: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400&h=300&fit=crop",
        isImage: true,
        description: "액티비티 테마의 등산 여행입니다.",
        createdAt: "2024-05-28",
        updatedAt: "2024-06-03"
      }
    ];
  }

  // 특정 아카이브 상세 조회
  async getArchiveDetail(archiveId: number): Promise<ArchiveDetail> {
    try {
      const response = await api.get(`${this.baseURL}/detail`, {
        params: { archiveId },
      });
      return response.data.data;
    } catch (error) {
      
      // 에러 시 더미 데이터 반환
      return this.getDummyArchiveDetail(archiveId);
    }
  }

  // 더미 아카이브 상세 데이터 반환
  private getDummyArchiveDetail(archiveId: number): ArchiveDetail {
    const archives = this.getDummyArchives();
    const archive = archives.find(a => a.id === archiveId) || archives[0];
    
    return {
      ...archive,
      missions: [
        {
          id: "1",
          time: "10:00",
          title: "첫 번째 미션",
          place: archive.location.split(" ")[1]?.replace(/[()]/g, "") + " 방문",
          img: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=200&h=150&fit=crop",
          description: archive.description + "의 첫 번째 미션입니다.",
          order: 1
        },
        {
          id: "2",
          time: "14:00",
          title: "두 번째 미션",
          place: archive.location.split(" ")[1]?.replace(/[()]/g, "") + " 체험",
          img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
          description: archive.description + "의 두 번째 미션입니다.",
          order: 2
        },
        {
          id: "3",
          time: "18:00",
          title: "세 번째 미션",
          place: archive.location.split(" ")[1]?.replace(/[()]/g, "") + " 완주",
          img: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=200&h=150&fit=crop",
          description: archive.description + "의 세 번째 미션입니다.",
          order: 3
        }
      ],
      photos: []
    };
  }

  // 새 아카이브 생성
  async createArchive(archiveData: Omit<Archive, "id" | "createdAt" | "updatedAt">): Promise<Archive> {
    try {
      const response = await api.post(this.baseURL, archiveData);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 아카이브 수정
  async updateArchive(archiveId: number, archiveData: Partial<Archive>): Promise<Archive> {
    try {
      const response = await api.put(`${this.baseURL}/${archiveId}`, archiveData);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 아카이브 삭제
  async deleteArchive(archiveId: number): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/${archiveId}`);
    } catch (error) {
      
      throw error;
    }
  }

  // 미션 추가
  async addMission(archiveId: number, missionData: Omit<Mission, "id">): Promise<Mission> {
    try {
      const response = await api.post(`${this.baseURL}/${archiveId}/missions`, missionData);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 미션 수정
  async updateMission(archiveId: number, missionId: string, missionData: Partial<Mission>): Promise<Mission> {
    try {
      const response = await api.put(`${this.baseURL}/${archiveId}/missions/${missionId}`, missionData);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 미션 삭제
  async deleteMission(archiveId: number, missionId: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/${archiveId}/missions/${missionId}`);
    } catch (error) {
      
      throw error;
    }
  }

  // 사진 업로드
  async uploadPhoto(archiveId: number, missionId: string, file: File): Promise<Photo> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await api.post(`${this.baseURL}/${archiveId}/missions/${missionId}/photos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 사진 삭제
  async deletePhoto(archiveId: number, missionId: string, photoId: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/${archiveId}/missions/${missionId}/photos/${photoId}`);
    } catch (error) {
      
      throw error;
    }
  }
}

export const archiveService = new ArchiveService();

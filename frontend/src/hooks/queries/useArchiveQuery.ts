"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveService, Archive } from "@/services/archiveService";

// Query Keys
export const archiveKeys = {
  all: ['archives'] as const,
  lists: () => [...archiveKeys.all, 'list'] as const,
  list: (filters: string) => [...archiveKeys.lists(), { filters }] as const,
  details: () => [...archiveKeys.all, 'detail'] as const,
  detail: (id: number) => [...archiveKeys.details(), id] as const,
};

// 아카이브 목록 조회
export function useArchives() {
  return useQuery({
    queryKey: archiveKeys.lists(),
    queryFn: () => archiveService.getArchives(),
    staleTime: 2 * 60 * 1000, // 2분
  });
}

// 아카이브 상세 조회
export function useArchive(id: number) {
  return useQuery({
    queryKey: archiveKeys.detail(id),
    queryFn: () => archiveService.getArchiveDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 아카이브 생성
export function useCreateArchive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (archive: Omit<Archive, 'id' | 'missions'>) => 
      archiveService.createArchive(archive),
    onSuccess: () => {
      // 목록 쿼리 무효화 (다시 fetch)
      queryClient.invalidateQueries({ queryKey: archiveKeys.lists() });
    },
  });
}

// 아카이브 수정
export function useUpdateArchive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Archive, 'id' | 'missions'>> }) =>
      archiveService.updateArchive(id, data),
    onSuccess: (_, variables) => {
      // 해당 아카이브의 상세 및 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: archiveKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: archiveKeys.lists() });
    },
  });
}

// 아카이브 삭제
export function useDeleteArchive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => archiveService.deleteArchive(id),
    onSuccess: () => {
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: archiveKeys.lists() });
    },
  });
}

// 미션 관련 mutations
export function useAddMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ archiveId, mission }: { archiveId: number; mission: any }) =>
      archiveService.addMission(archiveId, mission),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.detail(variables.archiveId) });
    },
  });
}

export function useUpdateMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ archiveId, missionId, mission }: { archiveId: number; missionId: string; mission: any }) =>
      archiveService.updateMission(archiveId, missionId, mission),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.detail(variables.archiveId) });
    },
  });
}

export function useDeleteMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ archiveId, missionId }: { archiveId: number; missionId: string }) =>
      archiveService.deleteMission(archiveId, missionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.detail(variables.archiveId) });
    },
  });
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { journeyService } from "@/services/journeyService";
import { CreateCommentRequest, ReportRequest, AddToArchiveRequest, JourneyPost } from "@/types/journey";

// Query Keys
export const journeyKeys = {
  all: ['journey'] as const,
  posts: (type: "feed" | "popular") => [...journeyKeys.all, 'posts', type] as const,
  post: (id: string) => [...journeyKeys.all, 'post', id] as const,
  comments: (postId: string) => [...journeyKeys.all, 'comments', postId] as const,
};

// 게시물 목록 조회
export function useJourneyPosts(type: "feed" | "popular" = "feed") {
  return useQuery({
    queryKey: journeyKeys.posts(type),
    queryFn: () => journeyService.getPosts(type),
    staleTime: 2 * 60 * 1000, // 2분
  });
}

// 게시물 상세 조회
export function useJourneyPost(postId: string) {
  return useQuery({
    queryKey: journeyKeys.post(postId),
    queryFn: () => journeyService.getPost(postId),
    enabled: !!postId,
  });
}

// 댓글 목록 조회
export function useComments(postId: string) {
  return useQuery({
    queryKey: journeyKeys.comments(postId),
    queryFn: () => journeyService.getComments(postId),
    enabled: !!postId,
  });
}

// 좋아요 토글 (낙관적 업데이트)
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        return await journeyService.toggleLike(postId);
      } catch (error) {
        // 백엔드 없이도 동작하도록 더미 응답 반환
        const posts = queryClient.getQueryData<JourneyPost[]>(journeyKeys.posts("feed")) || [];
        const post = posts.find(p => p.id === postId);
        if (post) {
          return {
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        throw error;
      }
    },
    onMutate: async (postId) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: journeyKeys.posts("feed") });
      await queryClient.cancelQueries({ queryKey: journeyKeys.posts("popular") });

      // 이전 데이터 저장
      const previousFeedPosts = queryClient.getQueryData<JourneyPost[]>(journeyKeys.posts("feed"));
      const previousPopularPosts = queryClient.getQueryData<JourneyPost[]>(journeyKeys.posts("popular"));

      // 낙관적 업데이트
      const updatePost = (posts: JourneyPost[] | undefined) => {
        if (!posts) return posts;
        return posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            };
          }
          return post;
        });
      };

      queryClient.setQueryData<JourneyPost[]>(
        journeyKeys.posts("feed"),
        updatePost(previousFeedPosts)
      );
      queryClient.setQueryData<JourneyPost[]>(
        journeyKeys.posts("popular"),
        updatePost(previousPopularPosts)
      );

      return { previousFeedPosts, previousPopularPosts };
    },
    onError: (err, postId, context) => {
      // 에러 시 롤백
      if (context?.previousFeedPosts) {
        queryClient.setQueryData(journeyKeys.posts("feed"), context.previousFeedPosts);
      }
      if (context?.previousPopularPosts) {
        queryClient.setQueryData(journeyKeys.posts("popular"), context.previousPopularPosts);
      }
    },
    onSettled: () => {
      // 완료 후 재검증 (백엔드 연동 시)
      // queryClient.invalidateQueries({ queryKey: journeyKeys.all });
    },
  });
}

// 북마크 토글 (낙관적 업데이트)
export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        return await journeyService.toggleBookmark(postId);
      } catch (error) {
        // 백엔드 없이도 동작하도록 더미 응답 반환
        const posts = queryClient.getQueryData<JourneyPost[]>(journeyKeys.posts("feed")) || [];
        const post = posts.find(p => p.id === postId);
        if (post) {
          return {
            isBookmarked: !post.isBookmarked,
          };
        }
        throw error;
      }
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: journeyKeys.posts("feed") });
      await queryClient.cancelQueries({ queryKey: journeyKeys.posts("popular") });

      const previousFeedPosts = queryClient.getQueryData<JourneyPost[]>(journeyKeys.posts("feed"));
      const previousPopularPosts = queryClient.getQueryData<JourneyPost[]>(journeyKeys.posts("popular"));

      const updatePost = (posts: JourneyPost[] | undefined) => {
        if (!posts) return posts;
        return posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isBookmarked: !post.isBookmarked,
            };
          }
          return post;
        });
      };

      queryClient.setQueryData<JourneyPost[]>(
        journeyKeys.posts("feed"),
        updatePost(previousFeedPosts)
      );
      queryClient.setQueryData<JourneyPost[]>(
        journeyKeys.posts("popular"),
        updatePost(previousPopularPosts)
      );

      return { previousFeedPosts, previousPopularPosts };
    },
    onError: (err, postId, context) => {
      if (context?.previousFeedPosts) {
        queryClient.setQueryData(journeyKeys.posts("feed"), context.previousFeedPosts);
      }
      if (context?.previousPopularPosts) {
        queryClient.setQueryData(journeyKeys.posts("popular"), context.previousPopularPosts);
      }
    },
  });
}

// 댓글 작성 (낙관적 업데이트)
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      try {
        return await journeyService.createComment(data);
      } catch (error) {
        // 백엔드 없이도 동작하도록 더미 응답 반환
        return {
          id: `temp-${Date.now()}`,
          postId: data.postId,
          userId: "current-user",
          user: {
            id: "current-user",
            nickname: "나",
            level: 1,
          },
          content: data.content,
          likes: 0,
          isLiked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    },
    onMutate: async (data) => {
      // 댓글 수 증가
      await queryClient.cancelQueries({ queryKey: journeyKeys.posts("feed") });
      await queryClient.cancelQueries({ queryKey: journeyKeys.posts("popular") });

      const previousFeedPosts = queryClient.getQueryData<JourneyPost[]>(journeyKeys.posts("feed"));
      const previousPopularPosts = queryClient.getQueryData<JourneyPost[]>(journeyKeys.posts("popular"));

      const updatePost = (posts: JourneyPost[] | undefined) => {
        if (!posts) return posts;
        return posts.map(post => {
          if (post.id === data.postId) {
            return {
              ...post,
              comments: post.comments + 1,
            };
          }
          return post;
        });
      };

      queryClient.setQueryData<JourneyPost[]>(
        journeyKeys.posts("feed"),
        updatePost(previousFeedPosts)
      );
      queryClient.setQueryData<JourneyPost[]>(
        journeyKeys.posts("popular"),
        updatePost(previousPopularPosts)
      );

      return { previousFeedPosts, previousPopularPosts };
    },
    onSuccess: (newComment, variables) => {
      // 댓글 목록에 새 댓글 추가
      queryClient.invalidateQueries({ queryKey: journeyKeys.comments(variables.postId) });
    },
    onError: (err, variables, context) => {
      // 에러 시 롤백
      if (context?.previousFeedPosts) {
        queryClient.setQueryData(journeyKeys.posts("feed"), context.previousFeedPosts);
      }
      if (context?.previousPopularPosts) {
        queryClient.setQueryData(journeyKeys.posts("popular"), context.previousPopularPosts);
      }
    },
  });
}

// 댓글 삭제
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => journeyService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.all });
    },
  });
}

// 댓글 좋아요 토글
export function useToggleCommentLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => journeyService.toggleCommentLike(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.all });
    },
  });
}

// 게시물 신고
export function useReportPost() {
  return useMutation({
    mutationFn: (data: ReportRequest) => journeyService.reportPost(data),
  });
}

// 아카이브에 추가
export function useAddToArchive() {
  return useMutation({
    mutationFn: (data: AddToArchiveRequest) => journeyService.addToArchive(data),
  });
}


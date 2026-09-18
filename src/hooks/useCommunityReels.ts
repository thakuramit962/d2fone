import { mapApiPostsToReels } from "@/components/basic/pages/chaupal/typePostMapper";
import API from "@/constants/api";
import { CommunityPost, CommunityPostReel } from "@/models/communityPost";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCommunityReelsOptions {
  pageLimit: number;
  isLoggedIn?: boolean;
  fetchLikes?: () => void | Promise<void>;
  endpoint?: string; // defaults to '/v1/community-posts'
}

interface FetchArgs {
  isRefresh?: boolean;
  isLoadMore?: boolean;
  pageOverride?: number;
}

export function useCommunityReels({
  pageLimit,
  isLoggedIn,
  fetchLikes,
  endpoint = "/v1/community-posts",
}: UseCommunityReelsOptions) {
  const [posts, setPosts] = useState<CommunityPostReel[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Avoids stale-closure issues with `page` inside fetchPosts
  // without having to put `page` in the callback's deps.
  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const fetchPosts = useCallback(
    async ({
      isRefresh = false,
      isLoadMore = false,
      pageOverride,
    }: FetchArgs = {}) => {
      const targetPage = pageOverride ?? (isLoadMore ? pageRef.current + 1 : 1);

      try {
        if (isRefresh) setRefreshing(true);
        else if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        setError(null);

        const res = await API.get(
          `${endpoint}?limit=${pageLimit}&page=${targetPage}`,
        );

        if (res.data?.status === "success") {
          const fetched: CommunityPost[] = res.data?.data?.data || [];
          const reels: CommunityPostReel[] = mapApiPostsToReels(fetched);
          setPosts((prev) => (isLoadMore ? [...prev, ...reels] : reels));
          setPage(targetPage);
          setHasMore(fetched.length >= pageLimit);
        } else {
          setError("Unable to fetch community posts.");
        }
      } catch (err) {
        console.error("Error fetching community posts", err);
        setError("Something went wrong while loading posts.");
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    // mapApiPostsToReels is a stable module-level import, not a dep.
    [endpoint, pageLimit],
  );

  useEffect(() => {
    fetchPosts();
    if (isLoggedIn) fetchLikes?.();
    // Intentionally run once on mount, mirroring original behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(() => {
    setHasMore(true);
    fetchPosts({ isRefresh: true, pageOverride: 1 });
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || loading || refreshing || !hasMore) return;
    fetchPosts({ isLoadMore: true });
  }, [fetchPosts, loadingMore, loading, refreshing, hasMore]);

  return {
    posts,
    setPosts,
    page,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    fetchPosts,
    handleRefresh,
    handleLoadMore,
  };
}

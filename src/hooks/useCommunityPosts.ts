import API from "@/constants/api";
import { updateCommunityPostState } from "@/slices/communityPostSlice";
import { RootState } from "@/store/store";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useCommunityPosts() {
  const dispatch = useDispatch();
  const likedPosts = useSelector(
    (state: RootState) => state?.communityPost?.likedPosts,
  );

  const isLiked = useCallback(
    (post_id: string) => {
      return likedPosts?.some((el) => el === post_id);
    },
    [likedPosts],
  );

  const fetchLikes = useCallback(() => {
    API.get("/v1/my-liked-community-posts")
      .then((res) => {
        if (res.data?.status == "success") {
          dispatch(updateCommunityPostState({ likedPosts: res.data?.data }));
        }
      })
      .catch((err) => {
        console.error("Error in like api", err);
      });
  }, []);

  const likePost = useCallback((post_id: string, type: "like" | "unlike") => {
    API.post("/v1/community-post-like", {
      post_id,
    })
      .then((res) => {
        if (res.data?.status == "success") {
          const newLikes =
            type == "like"
              ? [...new Set([...likedPosts, post_id])]
              : [...new Set([...likedPosts.filter((el) => el !== post_id)])];
          dispatch(updateCommunityPostState({ likedPosts: newLikes }));
        }
      })
      .catch((err) => {
        console.error("Error in like api", err);
      });
  }, []);

  return {
    likePost,
    isLiked,
    fetchLikes,
  };
}

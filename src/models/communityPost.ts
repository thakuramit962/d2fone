export interface CommunityPost {
  id: number;
  post_id: string;
  user_id: number;
  name: string;
  avtar: string | null;
  title: string;
  description: string;
  category: string;
  image_url: string[];
  video_link: string[];
  readmore_url: string;
  likes: number;
  status: 0 | 1;
  approved_status: 0 | 1;
  approved_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CommunityPostMediaType = {
  type: "img" | "video";
  link: string;
};

export interface CommunityPostReel extends CommunityPost {
  media?: CommunityPostMediaType[];
}

export const buildMediaFromPost = (
  post: Pick<CommunityPost, "image_url" | "video_link">,
): CommunityPostMediaType[] => [
  ...(post.image_url ?? []).map(
    (link): CommunityPostMediaType => ({ type: "img", link }),
  ),
  ...(post.video_link ?? []).map(
    (link): CommunityPostMediaType => ({ type: "video", link }),
  ),
];

export const getPostMedia = (
  post: CommunityPostReel,
): CommunityPostMediaType[] =>
  post.media && post.media.length > 0 ? post.media : buildMediaFromPost(post);

import {
  CommunityPost,
  CommunityPostReel,
  buildMediaFromPost,
} from "@/models/communityPost";

/**
 * Loose shape of what the API actually sends. Kept separate from
 * CommunityPost so the app-facing type isn't at the mercy of backend quirks
 * (stringified numbers, nulls where we want empty strings/arrays, etc).
 * Every field is optional/nullable here — normalization below fills gaps.
 */
export interface RawCommunityPost {
  id: number | string;
  post_id: string;
  user_id: number | string;
  name?: string | null;
  avtar?: string | null;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  image_url?: string[] | null;
  video_link?: string[] | null;
  readmore_url?: string | null;
  likes?: number | string | null;
  status?: number | string | null;
  approved_status?: number | string | null;
  approved_by?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

const toNumber = (value: unknown, fallback = 0): number => {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && !Number.isNaN(n) ? n : fallback;
};

const toBinaryFlag = (value: unknown): 0 | 1 => (toNumber(value) === 1 ? 1 : 0);

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string" && v.length > 0)
    : [];

/**
 * Normalizes one raw API record into the app's CommunityPost shape,
 * defending against nulls / stringified numbers the backend might send.
 */
export const normalizeCommunityPost = (
  raw: RawCommunityPost,
): CommunityPost => ({
  id: toNumber(raw.id),
  post_id: raw.post_id,
  user_id: toNumber(raw.user_id),
  name: raw.name ?? "Unknown",
  avtar: raw.avtar ?? null,
  title: raw.title ?? "",
  description: raw.description ?? "",
  category: raw.category ?? "",
  image_url: toStringArray(raw.image_url),
  video_link: toStringArray(raw.video_link),
  readmore_url: raw.readmore_url ?? "",
  likes: toNumber(raw.likes),
  status: toBinaryFlag(raw.status),
  approved_status: toBinaryFlag(raw.approved_status),
  approved_by: raw.approved_by ?? "",
  created_at: raw.created_at,
  updated_at: raw.updated_at,
  deleted_at: raw.deleted_at ?? null,
});

/**
 * Converts one raw API record into a CommunityPostReel, pre-building the
 * `media` array (images first, then videos) so components never need to
 * branch on image_url/video_link themselves.
 */
export const mapApiPostToReel = (raw: RawCommunityPost): CommunityPostReel => {
  const post = normalizeCommunityPost(raw);

  return {
    ...post,
    media: buildMediaFromPost(post),
  };
};

/**
 * Converts a raw API response (array of posts) into CommunityPostReel[].
 * Accepts `unknown` since this usually sits right at the network boundary;
 * anything that isn't an array is treated as empty rather than throwing.
 */
export const mapApiPostsToReels = (raw: unknown): CommunityPostReel[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => mapApiPostToReel(item as RawCommunityPost));
};

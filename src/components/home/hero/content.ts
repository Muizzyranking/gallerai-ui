export const content = {
  badge: "AI-Powered Event Galleries",
  headline: { line1: "Every", em1: "face.", line2: "Every", em2: "memory." },
  subheadline:
    "Upload your event photos. Guests scan their face and instantly get every photo they appear in. No searching. No shared drives. Under\u00a03\u00a0seconds.",
  ctas: {
    primary: { label: "Create your event", href: "/register" },
    secondary: { label: "See how it works", href: "#how-it-works" },
  },
  widget: {
    label: "Face Recognition",
    accuracy: { label: "ACCURACY", value: "98.7%" },
    speed: { label: "SPEED", value: "<3s" },
    photos: "4 PHOTOS FOUND",
    match: "✓ MATCH — 98.4%",
    download: "TAP TO DOWNLOAD",
  },
  socialProof: {
    count: "2,400+",
    label: "events hosted this month",
  },
} as const;

export interface BgImage {
  id: string;
  src: string;
  width: number;
  height: number;
  top: string;
  left: string;
  rotate: number;
  opacity: number;
  zIndex: number;
  float: "a" | "b" | "c";
  delay: number;
}

export interface GalleryThumb {
  id: string;
  gradient: string;
  src: string | null;
}

export const BG_IMAGES: BgImage[] = [
  {
    id: "bg-tl-1",
    src: "/images/hero/photo-1.jpg",
    width: 220,
    height: 160,
    top: "8%",
    left: "2%",
    rotate: -8,
    opacity: 0.55,
    zIndex: 0,
    float: "a",
    delay: 0,
  },
  {
    id: "bg-tl-2",
    src: "/images/hero/photo-2.jpg",
    width: 180,
    height: 240,
    top: "5%",
    left: "18%",
    rotate: 4,
    opacity: 0.45,
    zIndex: 0,
    float: "b",
    delay: 0.3,
  },
  {
    id: "bg-ml-1",
    src: "/images/hero/photo-3.jpg",
    width: 260,
    height: 180,
    top: "50%",
    left: "0%",
    rotate: -5,
    opacity: 0.5,
    zIndex: 0,
    float: "c",
    delay: 0.6,
  },
  {
    id: "bg-bl-1",
    src: "/images/hero/photo-4.jpg",
    width: 200,
    height: 150,
    top: "72%",
    left: "14%",
    rotate: 7,
    opacity: 0.4,
    zIndex: 0,
    float: "a",
    delay: 0.9,
  },
  {
    id: "bg-tr-1",
    src: "/images/hero/photo-5.jpg",
    width: 170,
    height: 220,
    top: "10%",
    left: "72%",
    rotate: 6,
    opacity: 0.5,
    zIndex: 0,
    float: "b",
    delay: 0.4,
  },
  {
    id: "bg-tr-2",
    src: "/images/hero/photo-6.jpg",
    width: 240,
    height: 170,
    top: "8%",
    left: "84%",
    rotate: -4,
    opacity: 0.45,
    zIndex: 0,
    float: "c",
    delay: 0.7,
  },
  {
    id: "bg-mr-1",
    src: "/images/hero/photo-7.jpg",
    width: 190,
    height: 260,
    top: "55%",
    left: "78%",
    rotate: -9,
    opacity: 0.55,
    zIndex: 0,
    float: "a",
    delay: 0.2,
  },
  {
    id: "bg-br-1",
    src: "/images/hero/photo-8.jpg",
    width: 210,
    height: 140,
    top: "78%",
    left: "88%",
    rotate: 5,
    opacity: 0.4,
    zIndex: 0,
    float: "b",
    delay: 1.0,
  },
];

export const BG_GRADIENTS: Record<string, string> = {
  "bg-tl-1": "linear-gradient(135deg,#3d1f1f,#6b2c2c)",
  "bg-tl-2": "linear-gradient(135deg,#1a2340,#2d4070)",
  "bg-ml-1": "linear-gradient(135deg,#1a3325,#2a5c3f)",
  "bg-bl-1": "linear-gradient(135deg,#2d1f3d,#4a3060)",
  "bg-tr-1": "linear-gradient(135deg,#3d2a10,#6b4a20)",
  "bg-tr-2": "linear-gradient(135deg,#1e2d3d,#2a4560)",
  "bg-mr-1": "linear-gradient(135deg,#3d1a2a,#6b2845)",
  "bg-br-1": "linear-gradient(135deg,#1a2d1a,#2a5530)",
};

export const GALLERY_THUMBS: GalleryThumb[] = [
  {
    id: "thumb-red",
    gradient: "linear-gradient(135deg,#3d1f1f,#7a3535)",
    src: null,
  },
  {
    id: "thumb-blue",
    gradient: "linear-gradient(135deg,#1a2340,#324878)",
    src: null,
  },
  {
    id: "thumb-green",
    gradient: "linear-gradient(135deg,#1a3325,#2f6644)",
    src: null,
  },
  {
    id: "thumb-plum",
    gradient: "linear-gradient(135deg,#2d1f3d,#523a6e)",
    src: null,
  },
];

export const AVATAR_COLORS = ["#5c2020", "#1e3358", "#1e3d2a", "#3d2a10"];

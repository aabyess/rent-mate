// next.config.ts
import type { NextConfig } from "next";

// 파트너 사진(Supabase Storage public 버킷) 렌더용 — 프로젝트 호스트는 env에서 파생
const supabaseHostname = new URL(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://xvnuvdsidzibpwrldink.supabase.co",
).hostname;

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: supabaseHostname,
				pathname: "/storage/v1/object/public/**",
			},
		],
	},
};

export default nextConfig;

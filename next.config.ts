// next.config.ts
import type { NextConfig } from "next";

// 파트너 사진(Supabase Storage public 버킷) 렌더용 — 프로젝트 호스트는 env에서 파생
const supabaseHostname = new URL(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://xvnuvdsidzibpwrldink.supabase.co",
).hostname;

const nextConfig: NextConfig = {
	images: {
		// 시드 파트너 일러스트(public/partners/*.svg) 렌더용. SVG 허용 시 Next 권장 안전조치 세트 동반
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

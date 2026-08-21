// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "RentMate",
		short_name: "RentMate",
		description: "시간제 데이트 동행 매칭 플랫폼",
		start_url: "/",
		display: "standalone",
		background_color: "#fafafa",
		theme_color: "#2b6ef5",
		icons: [
			{
				src: "/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
		],
	};
}

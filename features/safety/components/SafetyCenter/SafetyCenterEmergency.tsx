// features/safety/components/SafetyCenter/SafetyCenterEmergency.tsx
import type { JSX } from "react";

export function SafetyCenterEmergency(): JSX.Element {
	return (
		<section className="bg-surface flex flex-col gap-3 rounded-2xl p-4.5">
			<p className="text-sub text-sm">
				위험을 느끼면 망설이지 말고 바로 경찰에 신고하세요. 데이트는 항상 공개 장소에서만 진행돼요.
			</p>
			<a
				href="tel:112"
				className="bg-error-500 flex h-12 items-center justify-center gap-2 rounded-xl font-medium text-white">
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
				</svg>
				112 긴급 신고 전화
			</a>
			<p className="text-sub text-xs">
				앱 내 신고는 파트너 프로필이나 채팅방 우측 상단 ⋯ 메뉴에서 할 수 있어요. 신고 내용은
				운영팀이 확인 후 조치해요.
			</p>
		</section>
	);
}

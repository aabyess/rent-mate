// app/policies/safety/page.tsx
// ⚠️ 법무 검토 전 초안 — 시행 전 전문가 검토 필수.
import type { JSX } from "react";

const BANNED_BEHAVIORS = [
	"성적 서비스·신체접촉의 요구, 제안, 알선 및 이를 암시하는 모든 표현",
	"조건만남 등 성매매를 유도하는 대화, 광고, 외부 링크 공유",
	"공개 장소를 벗어난 장소(숙박업소, 주거지 등)로의 이동 요구",
	"폭언, 협박, 스토킹, 차별적 언행",
	"서비스 외부 직거래 유도 (연락처 교환을 통한 우회 거래 포함)",
];

const SANCTIONS = [
	{ level: "1단계", action: "경고 및 해당 콘텐츠 제한" },
	{ level: "2단계", action: "일정 기간 서비스 이용 정지" },
	{ level: "3단계", action: "영구 이용 정지 및 관계 법령에 따른 수사기관 통보" },
];

export default function SafetyPolicyPage(): JSX.Element {
	return (
		<article className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold">안전 정책</h1>
			<p className="text-sub text-sm leading-relaxed">
				RentMate는 공개 장소에서의 건전한 데이트 동행만을 제공합니다. 모든 회원의 안전을 위해 아래
				기준을 엄격하게 적용합니다.
			</p>

			<section className="flex flex-col gap-2.5">
				<h2 className="text-[17px] font-semibold">금지 행위</h2>
				<ul className="flex flex-col gap-2">
					{BANNED_BEHAVIORS.map(function (behavior) {
						return (
							<li
								key={behavior}
								className="bg-surface-alt text-body rounded-xl px-4 py-3 text-sm leading-relaxed">
								{behavior}
							</li>
						);
					})}
				</ul>
			</section>

			<section className="flex flex-col gap-2.5">
				<h2 className="text-[17px] font-semibold">감지와 기록</h2>
				<p className="text-sub text-sm leading-relaxed">
					모든 채팅은 저장되며 삭제할 수 없습니다 (청소년 보호를 위한 기술적 조치). 금지 행위가
					의심되는 대화는 자동으로 감지·기록되어 운영팀이 검토합니다.
				</p>
			</section>

			<section className="flex flex-col gap-2.5">
				<h2 className="text-[17px] font-semibold">제재 기준</h2>
				<ul className="flex flex-col gap-2">
					{SANCTIONS.map(function (sanction) {
						return (
							<li key={sanction.level} className="flex items-center gap-3 text-sm">
								<span className="bg-error-500/15 text-error-500 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold">
									{sanction.level}
								</span>
								<span className="text-body">{sanction.action}</span>
							</li>
						);
					})}
				</ul>
				<p className="text-sub text-xs">
					사안이 중대한 경우 단계를 거치지 않고 즉시 영구 정지될 수 있습니다.
				</p>
			</section>

			<section className="flex flex-col gap-2.5">
				<h2 className="text-[17px] font-semibold">신고 방법</h2>
				<p className="text-sub text-sm leading-relaxed">
					채팅방과 파트너 프로필의 신고 버튼으로 언제든 신고할 수 있습니다. 위급한 상황에서는 즉시
					112에 신고한 뒤, 마이페이지 &gt; 안전 센터의 긴급 연락을 이용해주세요. 신고 내용은
					운영팀만 볼 수 있으며, 신고를 이유로 한 불이익은 없습니다.
				</p>
			</section>
		</article>
	);
}

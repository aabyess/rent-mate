// app/policies/page.tsx
import Link from "next/link";
import type { JSX } from "react";

const POLICY_LINKS = [
	{
		href: "/policies/terms",
		title: "이용약관",
		description: "서비스 이용 조건과 회원의 권리·의무",
	},
	{
		href: "/policies/privacy",
		title: "개인정보처리방침",
		description: "수집하는 정보와 이용 목적, 보관 기준",
	},
	{
		href: "/policies/safety",
		title: "안전 정책",
		description: "금지 행위와 제재 기준, 신고 방법",
	},
];

export default function PoliciesPage(): JSX.Element {
	return (
		<div className="flex flex-col gap-3">
			{POLICY_LINKS.map(function (policy) {
				return (
					<Link
						key={policy.href}
						href={policy.href}
						className="bg-surface-alt flex items-center justify-between rounded-2xl px-4 py-4">
						<span className="flex flex-col gap-0.5">
							<span className="text-[15px] font-semibold">{policy.title}</span>
							<span className="text-sub text-[13px]">{policy.description}</span>
						</span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-sub shrink-0">
							<path d="M9 5l7 7-7 7" />
						</svg>
					</Link>
				);
			})}
		</div>
	);
}

// app/(main)/support/page.tsx
"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import Link from "next/link";
import type { JSX } from "react";

// TODO: 사용자 확정 전 플레이스홀더 이메일 — 실제 고객센터 주소로 교체 필요
const SUPPORT_EMAIL = "support@rentmate.example";

const FAQ_ITEMS = [
	{
		question: "예약을 취소하면 환불되나요?",
		answer:
			"데이트 시작 24시간 전까지는 전액 환불돼요. 이후 취소는 환불이 제한될 수 있어요. 예약 상세 화면의 '예약 취소' 버튼으로 직접 취소할 수 있어요.",
	},
	{
		question: "성인인증은 어떻게 하나요?",
		answer:
			"회원가입 후 온보딩 단계에서 생년월일을 입력하면 자동으로 성인 여부가 확인돼요. 만 19세 미만은 서비스를 이용할 수 없어요.",
	},
	{
		question: "부적절한 상대는 어떻게 신고하나요?",
		answer:
			"파트너 프로필이나 채팅방 상단의 ⋯ 메뉴에서 '신고하기'를 눌러 사유를 남겨주세요. 신고 내용은 운영팀만 확인하며, 마이페이지 > 안전 센터에서 신고 내역을 볼 수 있어요.",
	},
	{
		question: "파트너로 등록하려면 어떻게 하나요?",
		answer:
			"마이페이지의 '파트너로 활동하기'에서 프로필(닉네임, 소개, 활동 지역, 가능 요일, 시간당 요금)을 등록하면 관리자 승인 후 활동을 시작할 수 있어요.",
	},
];

export default function SupportPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-6 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<Link href="/me" aria-label="마이페이지로 돌아가기">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M15 5l-7 7 7 7" />
					</svg>
				</Link>
				<h1 className="text-lg font-bold">고객센터</h1>
			</div>

			<section className="flex flex-col gap-2.5">
				<h2 className="text-[17px] font-semibold">문의하기</h2>
				<p className="bg-surface-alt text-body rounded-2xl px-4 py-4 text-sm leading-relaxed">
					서비스 이용 중 궁금한 점이나 불편한 점이 있으면 이메일로 문의해주세요.
					<br />
					<a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand font-medium underline">
						{SUPPORT_EMAIL}
					</a>
				</p>
			</section>

			<section className="flex flex-col gap-2.5">
				<h2 className="text-[17px] font-semibold">자주 묻는 질문</h2>
				<div className="flex flex-col gap-2">
					{FAQ_ITEMS.map(function (item) {
						return (
							<Disclosure key={item.question} as="div" className="bg-surface-alt rounded-2xl">
								<DisclosureButton className="group flex w-full items-center justify-between px-4 py-3.5 text-left">
									<span className="text-[15px] font-medium">{item.question}</span>
									<svg
										className="text-sub shrink-0 transition-transform group-data-open:rotate-180"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round">
										<path d="M6 9l6 6 6-6" />
									</svg>
								</DisclosureButton>
								<DisclosurePanel className="text-sub px-4 pb-4 text-sm leading-relaxed">
									{item.answer}
								</DisclosurePanel>
							</Disclosure>
						);
					})}
				</div>
			</section>

			<section className="bg-warning-500/15 flex flex-col gap-1.5 rounded-2xl px-4 py-4">
				<span className="text-warning-500 text-sm font-semibold">위급한 상황이신가요?</span>
				<p className="text-warning-500 text-xs leading-relaxed">
					신체적 위협이나 긴급 상황에서는 즉시 112에 신고한 뒤,{" "}
					<Link href="/safety-center/emergency" className="font-semibold underline">
						안전 센터
					</Link>
					의 긴급 연락 기능을 이용해주세요.
				</p>
			</section>
		</main>
	);
}

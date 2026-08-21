// app/(main)/support/page.tsx
"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import Link from "next/link";
import { InquirySection } from "@/features/inquiries/components/InquirySection";
import type { JSX } from "react";

const FAQ_ITEMS = [
	{
		question: "예약을 취소하면 환불되나요?",
		answer:
			"데이트 시작 24시간 전까지 취소하면 결제 금액 전액이 환불돼요. 24시간 이내 취소는 수수료 50%를 제외하고 환불되고, 데이트 시작 이후에는 취소할 수 없어요. 예약 상세 화면의 '예약 취소' 버튼으로 직접 취소할 수 있어요.",
	},
	{
		question: "토큰은 어떻게 쓰이나요?",
		answer:
			"가입하면 토큰 500개가 무료로 지급돼요. 예약을 신청할 때 10개, 파트너가 데이트를 완료 처리하면 100개가 차감돼요. 토큰이 부족하면 마이페이지 > 내 토큰 지갑에서 충전할 수 있어요.",
	},
	{
		question: "예약 요금에 카페·식사 비용도 포함되나요?",
		answer:
			"아니요, 예약 시간당 요금은 파트너와의 동행 비용이에요. 데이트 중 카페, 식사, 입장료 등 실제로 쓰는 비용은 별도로 직접 부담해주세요.",
	},
	{
		question: "제 데이트 일정을 지인에게 알릴 수 있나요?",
		answer:
			"네, 예약 상세 화면의 '일정 공유하기' 버튼을 누르면 지인에게 보낼 수 있는 링크가 만들어져요. 링크를 받은 사람은 로그인 없이 데이트 일시와 장소를 확인할 수 있어 안전에 도움이 돼요.",
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

			<InquirySection />

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

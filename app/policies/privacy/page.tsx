// app/policies/privacy/page.tsx
// ⚠️ 법무 검토 전 초안 — 시행 전 전문가 검토 필수.
import type { JSX } from "react";

const SECTIONS = [
	{
		title: "1. 수집하는 개인정보",
		body: "회원가입 및 서비스 이용 과정에서 다음 정보를 수집합니다: 아이디, 이름, 생년월일(성인 여부 확인), 휴대전화 번호(본인확인), 파트너 프로필 정보(닉네임, 사진, 소개), 예약·결제 내역, 채팅 기록, 신고·제재 이력.",
	},
	{
		title: "2. 수집·이용 목적",
		body: "① 만 19세 이상 확인 등 법령상 의무 이행(청소년보호법) ② 본인확인 및 계정 관리 ③ 예약·결제·정산 등 서비스 제공 ④ 금지 행위 감지, 신고 처리 등 회원 안전 보호 ⑤ 분쟁 해결 및 법적 대응.",
	},
	{
		title: "3. 보유 및 이용 기간",
		body: "회원 탈퇴 시 지체 없이 파기합니다. 다만 채팅 기록은 청소년 보호를 위한 기술적 조치로서 관계 법령이 정한 기간 동안 보존되며, 전자상거래법 등 관계 법령에 따라 계약·결제 기록은 5년간 보관됩니다.",
	},
	{
		title: "4. 제3자 제공",
		body: "원칙적으로 개인정보를 외부에 제공하지 않습니다. 다만 수사기관이 법령에 정한 절차에 따라 요청하는 경우, 회원의 안전을 위해 긴급히 필요한 경우에는 제공될 수 있습니다.",
	},
	{
		title: "5. 처리 위탁",
		body: "서비스 운영을 위해 데이터 보관·인증 처리를 클라우드 인프라 사업자(Supabase Inc. 등)에 위탁합니다. 위탁 계약 시 개인정보 보호 관련 법령 준수를 명시합니다.",
	},
	{
		title: "6. 정보주체의 권리",
		body: "회원은 언제든지 자신의 개인정보 열람·정정·삭제·처리정지를 요구할 수 있습니다. 다만 법령상 보존 의무가 있는 정보(채팅 기록 등)는 삭제 요구가 제한될 수 있습니다.",
	},
	{
		title: "7. 안전성 확보 조치",
		body: "개인정보는 암호화된 통신 구간을 통해 전송되며, 접근 권한을 최소화한 데이터베이스 보안 정책(행 수준 보안)으로 보호됩니다.",
	},
];

export default function PrivacyPage(): JSX.Element {
	return (
		<article className="flex flex-col gap-5">
			<h1 className="text-2xl font-bold">개인정보처리방침</h1>
			{SECTIONS.map(function (section) {
				return (
					<section key={section.title} className="flex flex-col gap-1.5">
						<h2 className="text-[15px] font-semibold">{section.title}</h2>
						<p className="text-sub text-sm leading-relaxed">{section.body}</p>
					</section>
				);
			})}
		</article>
	);
}

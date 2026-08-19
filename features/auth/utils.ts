// features/auth/utils.ts

// 아이디 로그인: Supabase 인증은 이메일 기반이라 내부용 합성 이메일로 변환한다
const AUTH_EMAIL_DOMAIN = "rentmate-id.com";

export const USERNAME_PATTERN = "^[a-z0-9]{4,20}$";

export function isValidUsername(username: string): boolean {
	return new RegExp(USERNAME_PATTERN).test(username);
}

export function toAuthEmail(username: string): string {
	return `${username.toLowerCase()}@${AUTH_EMAIL_DOMAIN}`;
}

export function getSignUpErrorMessage(error: Error): string {
	const code = (error as { code?: string }).code;
	if (code === "user_already_exists") {
		return "이미 사용 중인 아이디예요. 다른 아이디를 입력해주세요.";
	}
	if (code === "email_provider_disabled" || code === "signup_disabled") {
		return "지금은 회원가입이 비활성화돼 있어요. 관리자에게 문의해주세요. (Supabase Email provider 설정)";
	}
	if (code === "weak_password") {
		return "비밀번호가 너무 약해요. 6자 이상으로 입력해주세요.";
	}
	return `가입에 실패했어요: ${error.message}`;
}

// 청소년보호법 기준: 19세가 되는 해의 1월 1일부터 성인 (연 나이)
export function isAdultByYouthProtectionAct(birthDate: string): boolean {
	const birthYear = new Date(birthDate).getFullYear();
	const currentYear = new Date().getFullYear();
	return currentYear - birthYear >= 19;
}

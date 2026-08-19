// features/auth/utils.ts

// 아이디 로그인: Supabase 인증은 이메일 기반이라 내부용 합성 이메일로 변환한다
const AUTH_EMAIL_DOMAIN = "id.rentmate.dev";

export const USERNAME_PATTERN = "^[a-z0-9]{4,20}$";

export function isValidUsername(username: string): boolean {
	return new RegExp(USERNAME_PATTERN).test(username);
}

export function toAuthEmail(username: string): string {
	return `${username.toLowerCase()}@${AUTH_EMAIL_DOMAIN}`;
}

// 청소년보호법 기준: 19세가 되는 해의 1월 1일부터 성인 (연 나이)
export function isAdultByYouthProtectionAct(birthDate: string): boolean {
	const birthYear = new Date(birthDate).getFullYear();
	const currentYear = new Date().getFullYear();
	return currentYear - birthYear >= 19;
}

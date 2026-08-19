// features/auth/utils.ts

// 청소년보호법 기준: 19세가 되는 해의 1월 1일부터 성인 (연 나이)
export function isAdultByYouthProtectionAct(birthDate: string): boolean {
	const birthYear = new Date(birthDate).getFullYear();
	const currentYear = new Date().getFullYear();
	return currentYear - birthYear >= 19;
}

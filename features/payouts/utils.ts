// features/payouts/utils.ts

// 계좌번호는 뒤 4자리만 노출한다.
export function maskAccountNumber(accountNumber: string): string {
	const digitsOnly = accountNumber.replace(/\D/g, "");
	const lastFour = digitsOnly.slice(-4);
	return `•••• ${lastFour}`;
}

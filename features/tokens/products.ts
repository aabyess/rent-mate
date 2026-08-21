// features/tokens/products.ts
// 실서비스 주의: 토큰은 앱 내에서 소비되는 디지털 재화라 Apple/Google 정책상 인앱결제(IAP)
// 대상이다. v1은 토스 테스트 키로 웹 결제만 붙였고, 스토어 출시 시 IAP 연동이 필요하다.

export type TokenProduct = {
	code: string;
	tokens: number;
	amountKrw: number;
	bonusLabel: string | null;
};

// 금액·구성 조정 시 이 배열만 바꾸면 된다 — DB(token_purchases)는 구매 시점 값을 그대로 기록한다.
export const TOKEN_PRODUCTS: TokenProduct[] = [
	{ code: "tokens_100", tokens: 100, amountKrw: 5000, bonusLabel: null },
	{ code: "tokens_550", tokens: 550, amountKrw: 25000, bonusLabel: "10% 보너스" },
	{ code: "tokens_1200", tokens: 1200, amountKrw: 50000, bonusLabel: "20% 보너스" },
];

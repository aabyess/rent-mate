// utils/regionMatch.ts
import { REGION_PROVINCES } from "@/constants/regions";

const PROVINCE_BY_VALUE = new Map<string, string>();
const PROVINCE_LABELS = new Set<string>();
REGION_PROVINCES.forEach(function (province) {
	PROVINCE_LABELS.add(province.label);
	PROVINCE_BY_VALUE.set(province.label, province.label);
	province.districts.forEach(function (district) {
		PROVINCE_BY_VALUE.set(district, province.label);
	});
});

// 저장된 region 값이 속한 시/도 라벨을 찾는다. 모르는 값(레거시 오탈자 등)은 null.
export function getProvinceOfRegion(value: string): string | null {
	return PROVINCE_BY_VALUE.get(value) ?? null;
}

// 값 자체가 시/도 단위(구체적인 하위 권역이 아니라 province label 그 자체)로만
// 저장돼 있는지 — regionsMatch가 "상위 시/도만 저장된 경우"를 판별하는 데 쓴다.
function isProvinceLevelValue(value: string): boolean {
	return PROVINCE_LABELS.has(value);
}

// 탐색 "내 주변만"과 운동 메이트 필터가 공유하는 지역 매칭 규칙 하나.
// 하위 권역 일치를 우선하고(정확히 같은 값), 둘 중 하나가 시/도 단위로만
// 저장돼 있으면 같은 시/도 소속 여부로 넓게 매칭한다. 서로 다른 구체적
// 하위 권역끼리는(예: "성수·성동" vs "강남·서초") 매칭하지 않는다.
export function regionsMatch(a: string, b: string): boolean {
	if (a === b) {
		return true;
	}
	const provinceA = getProvinceOfRegion(a);
	const provinceB = getProvinceOfRegion(b);
	if (provinceA === null || provinceB === null || provinceA !== provinceB) {
		return false;
	}
	return isProvinceLevelValue(a) || isProvinceLevelValue(b);
}

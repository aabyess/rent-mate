// constants/regions.ts

export type RegionProvince = {
	label: string;
	// 하위 권역이 없으면 빈 배열 — 탭하면 province label 자체가 즉시 선택값이 된다.
	districts: string[];
};

// 사장님 지정 메이저 순서 고정. 서울 하위 6권역 값은 기존 파트너·고객 데이터와
// 그대로 호환돼야 해서 절대 바꾸지 않는다(마이그레이션 없이 신·구 값이 공존).
export const REGION_PROVINCES: RegionProvince[] = [
	{
		label: "서울",
		districts: [
			"강남·서초",
			"홍대·마포",
			"성수·성동",
			"잠실·송파",
			"여의도·영등포",
			"종로·중구",
			"기타",
		],
	},
	{
		label: "경기",
		districts: ["수원", "성남", "고양", "용인", "부천", "경기 기타"],
	},
	{ label: "인천", districts: [] },
	{
		label: "부산",
		districts: ["해운대", "서면", "부산 기타"],
	},
	{ label: "대구", districts: [] },
	{ label: "대전", districts: [] },
	{ label: "광주", districts: [] },
	{ label: "울산", districts: [] },
	{ label: "세종", districts: [] },
	{ label: "강원", districts: [] },
	{ label: "충북", districts: [] },
	{ label: "충남", districts: [] },
	{ label: "전북", districts: [] },
	{ label: "전남", districts: [] },
	{ label: "경북", districts: [] },
	{ label: "경남", districts: [] },
	{ label: "제주", districts: [] },
];

// 과거 REGIONS(서울 권역만) 사용처 호환용 평면 목록 — 하위 권역이 없는 시/도는
// label 자체가 유일한 선택값이라 그대로 포함한다.
export const REGIONS: string[] = REGION_PROVINCES.flatMap(function (province) {
	return province.districts.length > 0 ? province.districts : [province.label];
});

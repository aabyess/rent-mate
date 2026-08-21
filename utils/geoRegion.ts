// utils/geoRegion.ts

type RegionBoundingBox = {
	region: string;
	minLat: number;
	maxLat: number;
	minLng: number;
	maxLng: number;
};

// 서울 권역 근사 바운딩박스 — 외부 지오코딩 API 없이 클라이언트에서 좌표를 권역으로만
// 변환한다. 좌표 자체는 이 함수 밖으로 전송·저장되지 않는다 (프라이버시 헌장 ①②).
// 촘촘한 박스일수록 먼저 검사해야 해서 순서가 있다: 서울 세부 권역 → 경기·부산 세부
// 도시 → 서울/경기/부산 대략 캐치올 → 나머지 시/도 대략 박스.
const FINE_BOUNDING_BOXES: RegionBoundingBox[] = [
	{ region: "강남·서초", minLat: 37.46, maxLat: 37.53, minLng: 127.0, maxLng: 127.12 },
	{ region: "홍대·마포", minLat: 37.54, maxLat: 37.58, minLng: 126.88, maxLng: 126.96 },
	{ region: "성수·성동", minLat: 37.53, maxLat: 37.58, minLng: 127.02, maxLng: 127.08 },
	{ region: "잠실·송파", minLat: 37.48, maxLat: 37.53, minLng: 127.08, maxLng: 127.15 },
	{ region: "여의도·영등포", minLat: 37.5, maxLat: 37.54, minLng: 126.88, maxLng: 126.96 },
	{ region: "종로·중구", minLat: 37.55, maxLat: 37.6, minLng: 126.96, maxLng: 127.02 },
	{ region: "수원", minLat: 37.24, maxLat: 37.3, minLng: 126.96, maxLng: 127.05 },
	{ region: "성남", minLat: 37.4, maxLat: 37.47, minLng: 127.1, maxLng: 127.18 },
	{ region: "고양", minLat: 37.6, maxLat: 37.7, minLng: 126.75, maxLng: 126.9 },
	{ region: "용인", minLat: 37.2, maxLat: 37.3, minLng: 127.15, maxLng: 127.28 },
	{ region: "부천", minLat: 37.47, maxLat: 37.53, minLng: 126.75, maxLng: 126.82 },
	{ region: "해운대", minLat: 35.15, maxLat: 35.2, minLng: 129.14, maxLng: 129.2 },
	{ region: "서면", minLat: 35.14, maxLat: 35.17, minLng: 129.05, maxLng: 129.08 },
];

// 서울 밖은 정밀도가 필요 없다 — 대략 박스로 시/도 단위만 잡고, 못 맞으면 수동
// 선택 폴백이 이미 있다.
const COARSE_BOUNDING_BOXES: RegionBoundingBox[] = [
	{ region: "기타", minLat: 37.42, maxLat: 37.7, minLng: 126.76, maxLng: 127.18 }, // 서울 캐치올
	{ region: "경기 기타", minLat: 36.9, maxLat: 38.3, minLng: 126.4, maxLng: 127.9 },
	{ region: "인천", minLat: 37.35, maxLat: 37.6, minLng: 126.35, maxLng: 126.75 },
	{ region: "부산 기타", minLat: 34.9, maxLat: 35.35, minLng: 128.85, maxLng: 129.3 },
	{ region: "대구", minLat: 35.75, maxLat: 35.95, minLng: 128.45, maxLng: 128.7 },
	{ region: "대전", minLat: 36.25, maxLat: 36.45, minLng: 127.3, maxLng: 127.5 },
	{ region: "광주", minLat: 35.05, maxLat: 35.25, minLng: 126.75, maxLng: 126.95 },
	{ region: "울산", minLat: 35.45, maxLat: 35.65, minLng: 129.25, maxLng: 129.45 },
	{ region: "세종", minLat: 36.45, maxLat: 36.65, minLng: 127.2, maxLng: 127.35 },
	{ region: "강원", minLat: 37.0, maxLat: 38.6, minLng: 127.5, maxLng: 129.4 },
	{ region: "충북", minLat: 36.0, maxLat: 37.2, minLng: 127.3, maxLng: 128.3 },
	{ region: "충남", minLat: 35.9, maxLat: 37.0, minLng: 126.3, maxLng: 127.3 },
	{ region: "전북", minLat: 35.4, maxLat: 36.2, minLng: 126.4, maxLng: 127.6 },
	{ region: "전남", minLat: 34.1, maxLat: 35.4, minLng: 126.0, maxLng: 127.6 },
	{ region: "경북", minLat: 35.6, maxLat: 37.2, minLng: 128.0, maxLng: 129.6 },
	{ region: "경남", minLat: 34.7, maxLat: 35.9, minLng: 127.5, maxLng: 129.2 },
	{ region: "제주", minLat: 33.1, maxLat: 33.6, minLng: 126.1, maxLng: 126.95 },
];

function findMatch(boxes: RegionBoundingBox[], latitude: number, longitude: number): string | null {
	const match = boxes.find(function (box) {
		return (
			latitude >= box.minLat &&
			latitude <= box.maxLat &&
			longitude >= box.minLng &&
			longitude <= box.maxLng
		);
	});
	return match?.region ?? null;
}

// 위경도를 권역 값으로 변환한다. 매칭되는 박스가 없으면 null(수동 선택 폴백 유도).
export function resolveRegionFromCoords(latitude: number, longitude: number): string | null {
	return (
		findMatch(FINE_BOUNDING_BOXES, latitude, longitude) ??
		findMatch(COARSE_BOUNDING_BOXES, latitude, longitude)
	);
}

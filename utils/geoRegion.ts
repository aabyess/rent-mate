// utils/geoRegion.ts
import {
	REGION_GANGNAM_SEOCHO,
	REGION_HONGDAE_MAPO,
	REGION_JAMSIL_SONGPA,
	REGION_JONGNO_JUNGGU,
	REGION_SEONGSU_SEONGDONG,
	REGION_YEOUIDO_YEONGDEUNGPO,
	type Region,
} from "@/constants/regions";

type RegionBoundingBox = {
	region: Region;
	minLat: number;
	maxLat: number;
	minLng: number;
	maxLng: number;
};

// 서울 권역 근사 바운딩박스 — 외부 지오코딩 API 없이 클라이언트에서 좌표를 권역으로만 변환한다.
// 좌표 자체는 이 함수 밖으로 전송·저장되지 않는다 (프라이버시 헌장 ①②).
const REGION_BOUNDING_BOXES: RegionBoundingBox[] = [
	{ region: REGION_GANGNAM_SEOCHO, minLat: 37.46, maxLat: 37.53, minLng: 127.0, maxLng: 127.12 },
	{ region: REGION_HONGDAE_MAPO, minLat: 37.54, maxLat: 37.58, minLng: 126.88, maxLng: 126.96 },
	{
		region: REGION_SEONGSU_SEONGDONG,
		minLat: 37.53,
		maxLat: 37.58,
		minLng: 127.02,
		maxLng: 127.08,
	},
	{ region: REGION_JAMSIL_SONGPA, minLat: 37.48, maxLat: 37.53, minLng: 127.08, maxLng: 127.15 },
	{
		region: REGION_YEOUIDO_YEONGDEUNGPO,
		minLat: 37.5,
		maxLat: 37.54,
		minLng: 126.88,
		maxLng: 126.96,
	},
	{ region: REGION_JONGNO_JUNGGU, minLat: 37.55, maxLat: 37.6, minLng: 126.96, maxLng: 127.02 },
];

// 위경도를 서울 권역으로 변환한다. 매칭되는 박스가 없으면 null(수동 선택 폴백 유도).
export function resolveRegionFromCoords(latitude: number, longitude: number): Region | null {
	const match = REGION_BOUNDING_BOXES.find(function (box) {
		return (
			latitude >= box.minLat &&
			latitude <= box.maxLat &&
			longitude >= box.minLng &&
			longitude <= box.maxLng
		);
	});
	return match?.region ?? null;
}

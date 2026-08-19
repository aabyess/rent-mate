// constants/regions.ts

export const REGION_GANGNAM_SEOCHO = "강남·서초";
export const REGION_HONGDAE_MAPO = "홍대·마포";
export const REGION_SEONGSU_SEONGDONG = "성수·성동";
export const REGION_JAMSIL_SONGPA = "잠실·송파";
export const REGION_YEOUIDO_YEONGDEUNGPO = "여의도·영등포";
export const REGION_JONGNO_JUNGGU = "종로·중구";
export const REGION_ETC = "기타";

export const REGIONS = [
	REGION_GANGNAM_SEOCHO,
	REGION_HONGDAE_MAPO,
	REGION_SEONGSU_SEONGDONG,
	REGION_JAMSIL_SONGPA,
	REGION_YEOUIDO_YEONGDEUNGPO,
	REGION_JONGNO_JUNGGU,
	REGION_ETC,
] as const;

export type Region = (typeof REGIONS)[number];

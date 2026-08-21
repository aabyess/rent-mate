// utils/kakaoMapLink.ts

// 외부 API 키 없이 쓸 수 있는 카카오맵 장소 검색 딥링크 — 위급 상황에서 지인이
// 탭 한 번으로 지도를 볼 수 있게 하는 게 목적.
export function getKakaoMapSearchUrl(place: string): string {
	return `https://map.kakao.com/link/search/${encodeURIComponent(place)}`;
}

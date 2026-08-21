// features/shared/components/HomeRegionPicker/index.tsx
"use client";

import { useState, type JSX } from "react";
import { RegionPicker } from "@/features/shared/components/RegionPicker";
import { resolveRegionFromCoords } from "@/utils/geoRegion";

type HomeRegionPickerProps = {
	value: string | null;
	onSelect: (region: string) => void;
};

type LocateStatus = "idle" | "locating" | "denied" | "unmatched";

// 프라이버시 헌장: 좌표는 이 컴포넌트 안에서 권역으로 변환되는 즉시 버려진다 — 서버로 전송·저장되지 않는다.
export function HomeRegionPicker({ value, onSelect }: HomeRegionPickerProps): JSX.Element {
	const [status, setStatus] = useState<LocateStatus>("idle");

	function handleLocate(): void {
		if (!navigator.geolocation) {
			setStatus("denied");
			return;
		}
		setStatus("locating");
		navigator.geolocation.getCurrentPosition(
			function (position) {
				const region = resolveRegionFromCoords(position.coords.latitude, position.coords.longitude);
				if (region === null) {
					setStatus("unmatched");
					return;
				}
				setStatus("idle");
				onSelect(region);
			},
			function () {
				setStatus("denied");
			},
			{ timeout: 10000 },
		);
	}

	return (
		<div className="flex flex-col gap-2.5">
			<button
				type="button"
				onClick={handleLocate}
				disabled={status === "locating"}
				className="bg-surface-alt text-body flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-medium disabled:opacity-60">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z" />
					<circle cx="12" cy="10" r="2.5" />
				</svg>
				{status === "locating" ? "위치 확인 중..." : "내 위치로 자동 설정"}
			</button>
			{status === "denied" && (
				<p className="text-sub text-xs">위치 권한을 확인할 수 없어요. 아래에서 직접 골라주세요.</p>
			)}
			{status === "unmatched" && (
				<p className="text-sub text-xs">
					지역을 자동으로 인식하지 못했어요. 아래에서 직접 골라주세요.
				</p>
			)}
			<RegionPicker selectedValues={value ? [value] : []} onToggle={onSelect} />
		</div>
	);
}

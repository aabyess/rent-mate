// features/shared/components/HomeRegionPicker/index.tsx
"use client";

import { useState, type JSX } from "react";
import { REGIONS } from "@/constants/regions";
import { resolveRegionFromCoords } from "@/utils/geoRegion";
import { cn } from "@/utils/cn";

type HomeRegionPickerProps = {
	value: string | null;
	onSelect: (region: string) => void;
};

type LocateStatus = "idle" | "locating" | "denied" | "outside-seoul";

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
					setStatus("outside-seoul");
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
			{status === "outside-seoul" && (
				<p className="text-sub text-xs">
					서울 권역 밖이라 자동 인식이 안 돼요. 아래에서 직접 골라주세요.
				</p>
			)}
			<div className="flex flex-wrap gap-2">
				{REGIONS.map(function (regionOption) {
					const selected = value === regionOption;
					return (
						<button
							key={regionOption}
							type="button"
							onClick={function () {
								onSelect(regionOption);
							}}
							className={cn(
								"h-10 rounded-full px-4 text-sm",
								selected && "bg-inverse text-inverse-fg font-semibold",
								!selected && "bg-surface-alt text-body",
							)}>
							{regionOption}
						</button>
					);
				})}
			</div>
		</div>
	);
}

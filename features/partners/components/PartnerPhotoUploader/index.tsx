// features/partners/components/PartnerPhotoUploader/index.tsx
"use client";

import { useEffect, useMemo, type ChangeEvent, type JSX } from "react";

export const MAX_PARTNER_PHOTOS = 9;
export const MIN_PARTNER_PHOTOS = 3;

type PartnerPhotoUploaderProps = {
	photos: File[];
	onPhotosChange: (photos: File[]) => void;
};

export function PartnerPhotoUploader({
	photos,
	onPhotosChange,
}: PartnerPhotoUploaderProps): JSX.Element {
	const previewUrls = useMemo(
		function () {
			return photos.map(function (photo) {
				return URL.createObjectURL(photo);
			});
		},
		[photos],
	);

	useEffect(
		function () {
			return function () {
				for (const url of previewUrls) {
					URL.revokeObjectURL(url);
				}
			};
		},
		[previewUrls],
	);

	function handleFilesChange(event: ChangeEvent<HTMLInputElement>): void {
		const files = Array.from(event.target.files ?? []);
		if (files.length > 0) {
			onPhotosChange([...photos, ...files].slice(0, MAX_PARTNER_PHOTOS));
		}
		event.target.value = "";
	}

	function handleRemove(removeIndex: number): void {
		onPhotosChange(
			photos.filter(function (_photo, index) {
				return index !== removeIndex;
			}),
		);
	}

	return (
		<div className="flex flex-wrap gap-2.5">
			{previewUrls.map(function (url, index) {
				return (
					<div key={url} className="relative size-24 overflow-hidden rounded-xl">
						{/* 로컬 미리보기(blob URL)라 next/image 최적화 대상이 아니다 */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={url}
							alt={`프로필 사진 ${index + 1}`}
							className="h-full w-full object-cover"
						/>
						<button
							type="button"
							onClick={function () {
								handleRemove(index);
							}}
							aria-label={`사진 ${index + 1} 삭제`}
							className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/50 text-white">
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round">
								<path d="M6 6l12 12M18 6L6 18" />
							</svg>
						</button>
					</div>
				);
			})}
			{photos.length < MAX_PARTNER_PHOTOS && (
				<label
					htmlFor="partner-photos"
					className="border-line text-sub flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
						<circle cx="12" cy="13" r="3.5" />
					</svg>
					<span className="text-xs">
						{photos.length}/{MAX_PARTNER_PHOTOS}
					</span>
					<input
						id="partner-photos"
						type="file"
						accept="image/jpeg,image/png,image/webp"
						multiple
						onChange={handleFilesChange}
						className="hidden"
					/>
				</label>
			)}
		</div>
	);
}

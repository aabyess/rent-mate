// features/partners/components/PartnerPhotoManager/index.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, type ChangeEvent, type JSX } from "react";
import { MAX_PARTNER_PHOTOS } from "@/features/partners/components/PartnerPhotoUploader";

type PartnerPhotoManagerProps = {
	existingUrls: string[];
	onExistingUrlsChange: (urls: string[]) => void;
	newPhotos: File[];
	onNewPhotosChange: (photos: File[]) => void;
};

// 수정 화면 전용 — 기존 업로드 URL과 신규 파일을 함께 관리한다 (등록 화면의 PartnerPhotoUploader는 신규 파일만 다룸)
export function PartnerPhotoManager({
	existingUrls,
	onExistingUrlsChange,
	newPhotos,
	onNewPhotosChange,
}: PartnerPhotoManagerProps): JSX.Element {
	const newPreviewUrls = useMemo(
		function () {
			return newPhotos.map(function (photo) {
				return URL.createObjectURL(photo);
			});
		},
		[newPhotos],
	);

	useEffect(
		function () {
			return function () {
				for (const url of newPreviewUrls) {
					URL.revokeObjectURL(url);
				}
			};
		},
		[newPreviewUrls],
	);

	const totalCount = existingUrls.length + newPhotos.length;

	function handleFilesChange(event: ChangeEvent<HTMLInputElement>): void {
		const files = Array.from(event.target.files ?? []);
		if (files.length > 0) {
			const remainingSlots = MAX_PARTNER_PHOTOS - totalCount;
			onNewPhotosChange([...newPhotos, ...files].slice(0, newPhotos.length + remainingSlots));
		}
		event.target.value = "";
	}

	function handleRemoveExisting(removeIndex: number): void {
		onExistingUrlsChange(
			existingUrls.filter(function (_url, index) {
				return index !== removeIndex;
			}),
		);
	}

	function handleRemoveNew(removeIndex: number): void {
		onNewPhotosChange(
			newPhotos.filter(function (_photo, index) {
				return index !== removeIndex;
			}),
		);
	}

	return (
		<div className="flex flex-wrap gap-2.5">
			{existingUrls.map(function (url, index) {
				return (
					<div key={url} className="relative size-24 overflow-hidden rounded-xl">
						<Image
							src={url}
							alt={`프로필 사진 ${index + 1}`}
							fill
							sizes="96px"
							className="object-cover"
						/>
						<button
							type="button"
							onClick={function () {
								handleRemoveExisting(index);
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
			{newPreviewUrls.map(function (url, index) {
				return (
					<div key={url} className="relative size-24 overflow-hidden rounded-xl">
						{/* 로컬 미리보기(blob URL)라 next/image 최적화 대상이 아니다 */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={url} alt={`새 사진 ${index + 1}`} className="h-full w-full object-cover" />
						<button
							type="button"
							onClick={function () {
								handleRemoveNew(index);
							}}
							aria-label={`새 사진 ${index + 1} 삭제`}
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
			{totalCount < MAX_PARTNER_PHOTOS && (
				<label
					htmlFor="partner-photos-edit"
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
						{totalCount}/{MAX_PARTNER_PHOTOS}
					</span>
					<input
						id="partner-photos-edit"
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

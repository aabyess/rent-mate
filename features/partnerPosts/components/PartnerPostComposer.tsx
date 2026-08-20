// features/partnerPosts/components/PartnerPostComposer.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useCreatePartnerPostMutation } from "@/features/partnerPosts/mutations";
import { findBannedPhrase } from "@/utils/bannedPhrases";

type PartnerPostComposerProps = {
	partnerId: string;
};

// 파트너 홈의 "오늘의 일기" 작성 — 사진 1장(선택) + 짧은 글
export function PartnerPostComposer({ partnerId }: PartnerPostComposerProps): JSX.Element {
	const createPostMutation = useCreatePartnerPostMutation(partnerId);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [content, setContent] = useState("");
	const [photo, setPhoto] = useState<File | null>(null);
	const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
	const [bannedPhrase, setBannedPhrase] = useState<string | null>(null);

	// 언마운트 시(작성 중 탭 전환 등) 미리보기 objectURL 해제
	useEffect(
		function () {
			return function () {
				if (photoPreviewUrl) {
					URL.revokeObjectURL(photoPreviewUrl);
				}
			};
		},
		[photoPreviewUrl],
	);

	function handlePhotoChange(event: ChangeEvent<HTMLInputElement>): void {
		const file = event.target.files?.[0] ?? null;
		setPhoto(file);
		if (photoPreviewUrl) {
			URL.revokeObjectURL(photoPreviewUrl);
		}
		setPhotoPreviewUrl(file ? URL.createObjectURL(file) : null);
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		const trimmed = content.trim();
		if (trimmed.length === 0) {
			return;
		}
		const banned = findBannedPhrase(trimmed);
		if (banned !== null) {
			setBannedPhrase(banned);
			return;
		}
		setBannedPhrase(null);
		createPostMutation.mutate(
			{ content: trimmed, photo },
			{
				onSuccess: function (): void {
					setContent("");
					setPhoto(null);
					if (photoPreviewUrl) {
						URL.revokeObjectURL(photoPreviewUrl);
					}
					setPhotoPreviewUrl(null);
					if (fileInputRef.current) {
						fileInputRef.current.value = "";
					}
				},
			},
		);
	}

	return (
		<form onSubmit={handleSubmit} className="bg-surface flex flex-col gap-3 rounded-2xl p-4">
			<span className="text-[15px] font-semibold">오늘의 일기</span>
			<textarea
				value={content}
				onChange={function (event) {
					setContent(event.target.value);
					setBannedPhrase(null);
				}}
				placeholder="오늘 어떤 하루였나요? 고객에게 보여줄 소식을 남겨보세요 (최대 500자)"
				maxLength={500}
				rows={3}
				className="bg-surface-alt text-body placeholder:text-sub w-full resize-none rounded-xl p-3.5 text-[15px] focus:outline-none"
			/>
			{photoPreviewUrl && (
				<div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
					<Image src={photoPreviewUrl} alt="첨부 사진 미리보기" fill className="object-cover" />
				</div>
			)}
			{bannedPhrase !== null && (
				<p className="text-error-500 text-xs">
					&lsquo;{bannedPhrase}&rsquo; 표현은 일기에 사용할 수 없어요.
				</p>
			)}
			{createPostMutation.isError && (
				<p className="text-error-500 text-xs">{createPostMutation.error.message}</p>
			)}
			<div className="flex items-center gap-2">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/png,image/webp"
					onChange={handlePhotoChange}
					className="hidden"
					id="partner-post-photo"
				/>
				<label
					htmlFor="partner-post-photo"
					className="border-line text-body flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-sm">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round">
						<rect x="3" y="5" width="18" height="14" rx="2" />
						<circle cx="9" cy="11" r="2" />
						<path d="M21 15l-4.5-4.5L7 20" />
					</svg>
					{photo ? "사진 변경" : "사진 추가"}
				</label>
				<Button
					type="submit"
					size="sm"
					className="ml-auto"
					disabled={content.trim().length === 0}
					isLoading={createPostMutation.isPending}>
					올리기
				</Button>
			</div>
		</form>
	);
}

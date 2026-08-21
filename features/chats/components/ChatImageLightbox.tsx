// features/chats/components/ChatImageLightbox.tsx
"use client";

import Image from "next/image";
import type { JSX } from "react";
import { useChatImageSignedUrlQuery } from "@/features/chats/queries";

type ChatImageLightboxProps = {
	imagePath: string;
	onClose: () => void;
};

// 채팅 이미지 전체화면 보기 — 탭/X로 닫기. 핀치줌은 브라우저 기본 동작에 맡긴다
// (touch-action 등을 따로 건드리지 않는다).
export function ChatImageLightbox({ imagePath, onClose }: ChatImageLightboxProps): JSX.Element {
	const { data: signedUrl, isPending, isError } = useChatImageSignedUrlQuery(imagePath);

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
			<button
				type="button"
				onClick={onClose}
				aria-label="닫기"
				className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
			{isPending && <div className="size-16 animate-pulse rounded-full bg-white/10" />}
			{isError && <p className="text-sm text-white/70">이미지를 불러오지 못했어요.</p>}
			{signedUrl && (
				<div className="relative h-full w-full">
					<Image
						src={signedUrl}
						alt="채팅 이미지 크게 보기"
						fill
						className="object-contain"
						unoptimized
					/>
				</div>
			)}
		</div>
	);
}

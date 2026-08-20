// features/chats/components/ChatImage.tsx
"use client";

import Image from "next/image";
import type { JSX } from "react";
import { useChatImageSignedUrlQuery } from "@/features/chats/queries";
import { cn } from "@/utils/cn";

type ChatImageProps = {
	imagePath: string;
	alt: string;
	className?: string;
};

// chat-images는 private 버킷이라 signed URL로만 렌더한다 (report 원문 카드에서도 재사용)
export function ChatImage({ imagePath, alt, className }: ChatImageProps): JSX.Element {
	const { data: signedUrl, isPending, isError } = useChatImageSignedUrlQuery(imagePath);

	if (isPending) {
		return <div className={cn("bg-surface-alt animate-pulse rounded-xl", className)} />;
	}
	if (isError || !signedUrl) {
		return (
			<div
				className={cn(
					"bg-surface-alt text-sub flex items-center justify-center rounded-xl text-xs",
					className,
				)}>
				이미지를 불러오지 못했어요.
			</div>
		);
	}
	return (
		<div className={cn("relative overflow-hidden rounded-xl", className)}>
			{/* signed URL은 재요청마다 토큰이 달라 Next 최적화 캐시가 재사용되지 않는다 — 그대로 렌더 */}
			<Image src={signedUrl} alt={alt} fill className="object-cover" unoptimized />
		</div>
	);
}

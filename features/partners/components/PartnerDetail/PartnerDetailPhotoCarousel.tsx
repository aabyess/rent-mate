// features/partners/components/PartnerDetail/PartnerDetailPhotoCarousel.tsx
"use client";

import Image from "next/image";
import { useRef, useState, type JSX, type UIEvent } from "react";
import { cn } from "@/utils/cn";

type PartnerDetailPhotoCarouselProps = {
	photoUrls: string[];
	nickname: string;
};

export function PartnerDetailPhotoCarousel({
	photoUrls,
	nickname,
}: PartnerDetailPhotoCarouselProps): JSX.Element {
	const [activeIndex, setActiveIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	if (photoUrls.length === 0) {
		return (
			<div className="from-primary-100 via-primary-200 to-primary-300 flex h-full w-full items-end justify-center bg-gradient-to-br">
				<svg
					width="230"
					height="230"
					viewBox="0 0 24 24"
					fill="var(--color-primary-400)"
					opacity="0.26">
					<circle cx="12" cy="8.5" r="3.6" />
					<path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7z" />
				</svg>
			</div>
		);
	}

	function handleScroll(event: UIEvent<HTMLDivElement>): void {
		const container = event.currentTarget;
		const index = Math.round(container.scrollLeft / container.clientWidth);
		setActiveIndex(index);
	}

	return (
		<div className="relative h-full w-full">
			<div
				ref={containerRef}
				onScroll={handleScroll}
				className="flex h-full w-full snap-x snap-mandatory scrollbar-none overflow-x-auto">
				{photoUrls.map(function (url, index) {
					return (
						<div key={url} className="relative h-full w-full shrink-0 snap-center">
							<Image
								src={url}
								alt={`${nickname} 프로필 사진 ${index + 1}`}
								fill
								sizes="448px"
								priority={index === 0}
								className="object-cover"
							/>
						</div>
					);
				})}
			</div>
			{photoUrls.length > 1 && (
				<div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 gap-1.5">
					{photoUrls.map(function (url, index) {
						return (
							<span
								key={url}
								className={cn(
									"h-1.5 rounded-full transition-all",
									index === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50",
								)}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}

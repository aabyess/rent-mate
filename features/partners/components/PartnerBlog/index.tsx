// features/partners/components/PartnerBlog/index.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ChangeEvent, type JSX } from "react";
import { PartnerPostComposer } from "@/features/partnerPosts/components/PartnerPostComposer";
import { PartnerPostList } from "@/features/partnerPosts/components/PartnerPostList";
import { PartnerBlogGreeting } from "@/features/partners/components/PartnerBlog/PartnerBlogGreeting";
import { usePatchBlogCoverMutation } from "@/features/partners/mutations";
import type { MyPartnerProfile } from "@/features/partners/types";

type PartnerBlogProps = {
	partnerProfile: MyPartnerProfile;
};

// 파트너의 "내 블로그" — 커버(직접 지정한 사진, 없으면 대표 사진)+소개 헤더 아래에
// 일기를 쓰고 관리한다. 고객에게는 파트너 상세의 '소식' 섹션으로 같은 글이 노출된다.
export function PartnerBlog({ partnerProfile }: PartnerBlogProps): JSX.Element {
	const patchCoverMutation = usePatchBlogCoverMutation();
	const coverFileInputRef = useRef<HTMLInputElement>(null);
	const coverUrl = partnerProfile.blog_cover_url ?? partnerProfile.photo_urls[0];

	function handleCoverChange(event: ChangeEvent<HTMLInputElement>): void {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}
		patchCoverMutation.mutate(file, {
			onSuccess: function (): void {
				if (coverFileInputRef.current) {
					coverFileInputRef.current.value = "";
				}
			},
		});
	}

	return (
		<div className="flex flex-col gap-3.5 px-5 py-4">
			<div className="relative h-44 overflow-hidden rounded-3xl">
				{coverUrl && (
					<Image
						src={coverUrl}
						alt={`${partnerProfile.nickname} 커버 사진`}
						fill
						sizes="(max-width: 448px) 100vw, 408px"
						className="object-cover"
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
				<Link
					href="/partner/edit"
					className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-900">
					프로필 수정
				</Link>
				<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
					<div className="flex flex-col gap-0.5 text-white">
						<span className="text-xl font-bold">{partnerProfile.nickname}의 블로그</span>
						<span className="text-[13px] text-white/85">
							{[partnerProfile.region, ...partnerProfile.purpose_tags].join(" · ")}
						</span>
					</div>
					<input
						ref={coverFileInputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp"
						onChange={handleCoverChange}
						className="hidden"
						id="partner-blog-cover-upload"
					/>
					<label
						htmlFor="partner-blog-cover-upload"
						className="shrink-0 cursor-pointer rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-900">
						{patchCoverMutation.isPending ? "업로드 중..." : "커버 변경"}
					</label>
				</div>
			</div>

			{patchCoverMutation.isError && (
				<p className="text-error-500 text-xs">{patchCoverMutation.error.message}</p>
			)}

			<PartnerBlogGreeting greeting={partnerProfile.blog_greeting} />

			<p className="text-sub bg-surface rounded-2xl px-4 py-3 text-[13px] leading-relaxed">
				여기에 올린 글과 사진은 고객이 보는 내 프로필의{" "}
				<span className="text-body font-medium">소식</span> 섹션에 그대로 보여요. 일상·데이트 코스
				이야기로 나를 어필해보세요.
			</p>

			<PartnerPostComposer partnerId={partnerProfile.profile_id} />

			<PartnerPostList
				partnerId={partnerProfile.profile_id}
				partnerNickname={partnerProfile.nickname}
			/>
		</div>
	);
}

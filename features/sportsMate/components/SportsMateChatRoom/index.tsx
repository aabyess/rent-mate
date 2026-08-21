// features/sportsMate/components/SportsMateChatRoom/index.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { useMyProfileQuery } from "@/features/auth/queries";
import { SportsMateChatRoomMessageList } from "@/features/sportsMate/components/SportsMateChatRoom/SportsMateChatRoomMessageList";
import { useSportsMateChatRealtime } from "@/features/sportsMate/hooks";
import { useSendSportsMateMessageMutation } from "@/features/sportsMate/mutations";
import {
	useSportsMateMessagesQuery,
	useSportsMatePostQuery,
	useSportsMateRequestQuery,
} from "@/features/sportsMate/queries";
import type { SportsMateMessage } from "@/features/sportsMate/types";
import { BlockConfirmDialog } from "@/features/safety/components/BlockConfirmDialog";
import { ReportDialog } from "@/features/safety/components/ReportDialog";
import { findBannedPhrase } from "@/utils/bannedPhrases";
import { findContactInfoLeak } from "@/utils/contactLeakKeywords";

type SportsMateChatRoomProps = {
	requestId: string;
};

export function SportsMateChatRoom({ requestId }: SportsMateChatRoomProps): JSX.Element {
	const router = useRouter();
	const { data: profile } = useMyProfileQuery();
	const { data: request, isPending: isRequestPending } = useSportsMateRequestQuery(requestId);
	const { data: post, isPending: isPostPending } = useSportsMatePostQuery(request?.post_id ?? "");
	const { data: messages, isPending: isMessagesPending } = useSportsMateMessagesQuery(requestId);
	const sendMessageMutation = useSendSportsMateMessageMutation(requestId);
	useSportsMateChatRealtime(requestId);

	const [content, setContent] = useState("");
	const [isReportOpen, setIsReportOpen] = useState(false);
	const [isBlockOpen, setIsBlockOpen] = useState(false);
	const [bannedPhrase, setBannedPhrase] = useState<string | null>(null);
	const [showContactLeakNotice, setShowContactLeakNotice] = useState(false);
	const [reportContext, setReportContext] = useState<string | null>(null);

	function handleBack(): void {
		router.back();
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		const trimmed = content.trim();
		if (trimmed.length === 0 || sendMessageMutation.isPending) {
			return;
		}
		const detected = findBannedPhrase(trimmed);
		if (detected !== null) {
			setBannedPhrase(detected);
			return;
		}
		setShowContactLeakNotice(findContactInfoLeak(trimmed) !== null);
		sendMessageMutation.mutate(trimmed, {
			onSuccess: function (): void {
				setContent("");
			},
		});
	}

	if (isRequestPending || isPostPending || isMessagesPending || !profile) {
		return (
			<div className="flex flex-col gap-3 px-5 py-5">
				<div className="bg-surface-alt h-14 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-64 animate-pulse rounded-2xl" />
			</div>
		);
	}

	if (!request || !post || request.status !== "accepted") {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<p className="text-sub text-sm">채팅방을 찾을 수 없어요.</p>
				<Link href="/sports-mate" className="text-brand font-medium underline">
					운동 메이트로
				</Link>
			</div>
		);
	}

	const isRequester = request.requester_id === profile.id;
	const counterpartId = isRequester ? post.author_id : request.requester_id;
	const counterpartName = isRequester ? post.author_name : request.requester_name;

	return (
		<div className="flex min-h-screen flex-col">
			<header className="border-line bg-surface/80 sticky top-0 z-10 flex flex-col gap-2.5 border-b px-5 py-3 backdrop-blur-xl">
				<div className="flex items-center gap-3">
					<button type="button" onClick={handleBack} aria-label="뒤로 가기">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M15 5l-7 7 7 7" />
						</svg>
					</button>
					<h1 className="text-lg font-bold">{counterpartName}</h1>
					<button
						type="button"
						onClick={function () {
							setReportContext(`운동메이트 매칭 ${requestId}`);
							setIsReportOpen(true);
						}}
						className="text-error-500 ml-auto text-sm font-medium">
						신고
					</button>
					<button
						type="button"
						onClick={function () {
							setIsBlockOpen(true);
						}}
						className="text-sub text-sm font-medium">
						차단
					</button>
				</div>
				<div className="bg-surface-alt flex items-center justify-between rounded-xl px-3.5 py-2.5">
					<span className="text-sub text-xs">
						{post.sport} · {post.region}
					</span>
				</div>
			</header>

			<div className="grow px-5 py-4 pb-28">
				<p className="bg-warning-500/15 text-warning-500 mb-4 rounded-xl px-3.5 py-2.5 text-center text-xs">
					대화는 안전을 위해 저장되며 삭제할 수 없어요 · 조건만남 유도 시 제재됩니다
				</p>
				<SportsMateChatRoomMessageList
					messages={messages ?? []}
					myProfileId={profile.id}
					onReportClick={function (message: SportsMateMessage) {
						setReportContext(`운동메이트 채팅 메시지 ${message.id}`);
						setIsReportOpen(true);
					}}
				/>
			</div>

			<form
				onSubmit={handleSubmit}
				className="border-line bg-surface/80 fixed bottom-0 left-1/2 z-10 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 border-t px-4 pt-3 pb-6 backdrop-blur-xl">
				{bannedPhrase !== null && (
					<p className="text-error-500 text-xs">
						&lsquo;{bannedPhrase}&rsquo; 표현이 포함된 메시지는 보낼 수 없어요. 조건만남 유도 등
						금지 행위는 제재 대상입니다.
					</p>
				)}
				{showContactLeakNotice && (
					<p className="bg-warning-100 text-warning-700 rounded-lg px-3 py-2 text-xs">
						외부 연락처 공유는 안전을 위해 기록됩니다.
					</p>
				)}
				<div className="flex items-center gap-2">
					<input
						value={content}
						onChange={function (event) {
							setContent(event.target.value);
							setBannedPhrase(null);
							setShowContactLeakNotice(false);
						}}
						placeholder="메시지 보내기"
						maxLength={2000}
						className="bg-surface-alt text-body placeholder:text-sub h-11 grow rounded-full px-4 text-[15px] focus:outline-none"
					/>
					<button
						type="submit"
						disabled={content.trim().length === 0 || sendMessageMutation.isPending}
						aria-label="보내기"
						aria-busy={sendMessageMutation.isPending}
						className="bg-brand flex size-11 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
						</svg>
					</button>
				</div>
			</form>

			{isReportOpen && (
				<ReportDialog
					onClose={function () {
						setIsReportOpen(false);
						setReportContext(null);
					}}
					targetId={counterpartId}
					targetNickname={counterpartName}
					reasonContext={reportContext ?? undefined}
				/>
			)}

			{isBlockOpen && (
				<BlockConfirmDialog
					onClose={function () {
						setIsBlockOpen(false);
					}}
					targetId={counterpartId}
					targetNickname={counterpartName}
				/>
			)}
		</div>
	);
}

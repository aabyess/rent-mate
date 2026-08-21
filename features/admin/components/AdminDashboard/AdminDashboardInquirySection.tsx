// features/admin/components/AdminDashboard/AdminDashboardInquirySection.tsx
"use client";

import { useState, type JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAnswerInquiryMutation } from "@/features/inquiries/mutations";
import { useAdminInquiriesQuery } from "@/features/inquiries/queries";
import type { AdminInquiryItem } from "@/features/inquiries/types";

function AdminInquiryCard({ inquiry }: { inquiry: AdminInquiryItem }): JSX.Element {
	const answerMutation = useAnswerInquiryMutation();
	const [draft, setDraft] = useState("");

	function handleAnswer(): void {
		const trimmed = draft.trim();
		if (trimmed.length === 0) {
			return;
		}
		answerMutation.mutate({ inquiryId: inquiry.id, answer: trimmed });
	}

	return (
		<article className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
			<div className="flex items-center justify-between">
				<span className="text-sm font-semibold">
					{inquiry.authorName} <span className="text-sub font-normal">· {inquiry.category}</span>
				</span>
				<Badge variant={inquiry.status === "answered" ? "trust" : "warning"}>
					{inquiry.status === "answered" ? "답변 완료" : "답변 대기"}
				</Badge>
			</div>
			<p className="text-body text-sm leading-relaxed whitespace-pre-wrap">{inquiry.content}</p>
			{inquiry.status === "answered" ? (
				inquiry.answer && <p className="text-sub text-xs leading-relaxed">답변: {inquiry.answer}</p>
			) : (
				<div className="flex gap-2">
					<Input
						value={draft}
						onChange={function (event) {
							setDraft(event.target.value);
						}}
						placeholder="답변 입력"
					/>
					<Button
						size="sm"
						disabled={draft.trim().length === 0}
						isLoading={answerMutation.isPending}
						onClick={handleAnswer}
						className="shrink-0">
						답변
					</Button>
				</div>
			)}
		</article>
	);
}

export function AdminDashboardInquirySection(): JSX.Element {
	const { data: inquiries, isPending, isError } = useAdminInquiriesQuery();

	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">1:1 문의</h2>
			{isPending && <div className="bg-surface-alt h-24 animate-pulse rounded-2xl" />}
			{isError && <p className="text-sub py-6 text-center text-sm">목록을 불러오지 못했어요.</p>}
			{inquiries && inquiries.length === 0 && (
				<p className="bg-surface-alt text-sub rounded-2xl px-4 py-6 text-center text-sm">
					접수된 문의가 없어요.
				</p>
			)}
			{inquiries &&
				inquiries.map(function (inquiry) {
					return <AdminInquiryCard key={inquiry.id} inquiry={inquiry} />;
				})}
		</section>
	);
}

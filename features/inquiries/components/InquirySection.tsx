// features/inquiries/components/InquirySection.tsx
"use client";

import { useState, type FormEvent, type JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCreateInquiryMutation } from "@/features/inquiries/mutations";
import { useMyInquiriesQuery } from "@/features/inquiries/queries";
import { cn } from "@/utils/cn";

const CATEGORIES = ["이용 문의", "버그 신고", "결제·정산", "기타"];

function formatInquiryDate(createdAt: string): string {
	const date = new Date(createdAt);
	return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 고객센터 1:1 문의 — 접수 폼 + 내 문의 내역(답변 표시)
export function InquirySection(): JSX.Element {
	const createInquiryMutation = useCreateInquiryMutation();
	const { data: inquiries, isPending } = useMyInquiriesQuery();
	const [category, setCategory] = useState(CATEGORIES[0]);
	const [content, setContent] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		const trimmed = content.trim();
		if (trimmed.length === 0) {
			return;
		}
		createInquiryMutation.mutate(
			{ category, content: trimmed },
			{
				onSuccess: function (): void {
					setContent("");
				},
			},
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">1:1 문의</h2>
				<form onSubmit={handleSubmit} className="bg-surface flex flex-col gap-3 rounded-2xl p-4">
					<div className="flex flex-wrap gap-2">
						{CATEGORIES.map(function (item) {
							const selected = category === item;
							return (
								<button
									key={item}
									type="button"
									onClick={function () {
										setCategory(item);
									}}
									className={cn(
										"h-9 rounded-full px-3.5 text-[13px]",
										selected && "bg-inverse text-inverse-fg font-semibold",
										!selected && "bg-surface-alt text-body",
									)}>
									{item}
								</button>
							);
						})}
					</div>
					<textarea
						value={content}
						onChange={function (event) {
							setContent(event.target.value);
						}}
						placeholder="궁금한 점이나 불편한 점을 자세히 적어주세요 (최대 1,000자)"
						maxLength={1000}
						rows={4}
						className="bg-surface-alt text-body placeholder:text-sub w-full resize-none rounded-xl p-3.5 text-[15px] focus:outline-none"
					/>
					{createInquiryMutation.isSuccess && (
						<p className="text-trust text-sm">
							문의가 접수됐어요. 보통 1~2 영업일 내 답변드려요. 답변은 이 화면에서 확인할 수 있어요.
						</p>
					)}
					{createInquiryMutation.isError && (
						<p className="text-error-500 text-sm">{createInquiryMutation.error.message}</p>
					)}
					<Button
						type="submit"
						fullWidth
						disabled={content.trim().length === 0}
						isLoading={createInquiryMutation.isPending}>
						문의 접수하기
					</Button>
				</form>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">내 문의 내역</h2>
				{isPending && <div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />}
				{inquiries && inquiries.length === 0 && (
					<p className="text-sub py-6 text-center text-sm">아직 접수한 문의가 없어요.</p>
				)}
				{inquiries &&
					inquiries.map(function (inquiry) {
						return (
							<article
								key={inquiry.id}
								className="bg-surface-alt flex flex-col gap-2 rounded-2xl p-4">
								<div className="flex items-center justify-between">
									<span className="text-sub text-xs">
										{inquiry.category} · {formatInquiryDate(inquiry.created_at)}
									</span>
									<Badge variant={inquiry.status === "answered" ? "trust" : "warning"}>
										{inquiry.status === "answered" ? "답변 완료" : "답변 대기"}
									</Badge>
								</div>
								<p className="text-body text-sm leading-relaxed whitespace-pre-wrap">
									{inquiry.content}
								</p>
								{inquiry.answer && (
									<div className="bg-surface flex flex-col gap-1 rounded-xl px-3.5 py-3">
										<span className="text-trust text-xs font-semibold">운영팀 답변</span>
										<p className="text-body text-sm leading-relaxed whitespace-pre-wrap">
											{inquiry.answer}
										</p>
									</div>
								)}
							</article>
						);
					})}
			</section>
		</div>
	);
}

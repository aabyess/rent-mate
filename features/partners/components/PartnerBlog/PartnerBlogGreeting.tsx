// features/partners/components/PartnerBlog/PartnerBlogGreeting.tsx
"use client";

import { useState, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { usePatchBlogGreetingMutation } from "@/features/partners/mutations";

type PartnerBlogGreetingProps = {
	greeting: string | null;
};

export function PartnerBlogGreeting({ greeting }: PartnerBlogGreetingProps): JSX.Element {
	const patchGreetingMutation = usePatchBlogGreetingMutation();
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(greeting ?? "");

	function handleEditClick(): void {
		setDraft(greeting ?? "");
		setIsEditing(true);
	}

	function handleCancel(): void {
		setIsEditing(false);
	}

	function handleSave(): void {
		patchGreetingMutation.mutate(draft, {
			onSuccess: function (): void {
				setIsEditing(false);
			},
		});
	}

	if (isEditing) {
		return (
			<div className="bg-surface flex flex-col gap-2.5 rounded-2xl px-4 py-3.5">
				<textarea
					value={draft}
					onChange={function (event) {
						setDraft(event.target.value);
					}}
					placeholder="고객에게 보여줄 짧은 인사말을 남겨보세요 (최대 120자)"
					maxLength={120}
					rows={2}
					className="bg-surface-alt text-body placeholder:text-sub w-full resize-none rounded-xl p-3 text-sm focus:outline-none"
				/>
				{patchGreetingMutation.isError && (
					<p className="text-error-500 text-xs">{patchGreetingMutation.error.message}</p>
				)}
				<div className="flex gap-2">
					<Button variant="outline" size="sm" fullWidth onClick={handleCancel}>
						취소
					</Button>
					<Button
						size="sm"
						fullWidth
						isLoading={patchGreetingMutation.isPending}
						onClick={handleSave}>
						저장
					</Button>
				</div>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={handleEditClick}
			className="bg-surface flex items-center gap-2.5 rounded-2xl px-4 py-3.5 text-left">
			<span className="text-body flex-1 text-[13px] leading-relaxed">
				{greeting ?? "고객에게 보여줄 인사말을 남겨보세요"}
			</span>
			<svg
				className="text-sub shrink-0"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M12 20h9" />
				<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
			</svg>
		</button>
	);
}

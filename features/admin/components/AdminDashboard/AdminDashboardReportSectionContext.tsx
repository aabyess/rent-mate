// features/admin/components/AdminDashboard/AdminDashboardReportSectionContext.tsx
"use client";

import type { JSX } from "react";
import { ChatImage } from "@/features/chats/components/ChatImage";
import { useReportContextQuery } from "@/features/admin/queries";
import type { ReportContext, ReportContextType } from "@/features/admin/types";

const CONTEXT_TYPE_LABELS: Record<ReportContextType, string> = {
	review: "신고된 후기 원문",
	chat_message: "신고된 채팅 메시지 원문",
	diary: "신고된 일기 원문",
};

type AdminDashboardReportSectionContextProps = {
	context: ReportContext;
};

export function AdminDashboardReportSectionContext({
	context,
}: AdminDashboardReportSectionContextProps): JSX.Element {
	const { data, isPending, isError } = useReportContextQuery(context);

	return (
		<div className="bg-surface flex flex-col gap-2 rounded-xl px-3.5 py-2.5">
			<span className="text-sub text-xs font-medium">{CONTEXT_TYPE_LABELS[context.type]}</span>
			{isPending && <div className="bg-surface-alt h-4 w-2/3 animate-pulse rounded" />}
			{isError && <p className="text-error-500 text-xs">원문을 불러오지 못했어요.</p>}
			{!isPending && !isError && (
				<>
					{data?.imagePath && (
						<ChatImage imagePath={data.imagePath} alt="신고된 채팅 이미지" className="h-40 w-40" />
					)}
					{data?.content && (
						<p className="text-body text-sm leading-relaxed whitespace-pre-wrap">{data.content}</p>
					)}
					{!data?.content && !data?.imagePath && (
						<p className="text-body text-sm leading-relaxed">
							삭제되었거나 찾을 수 없는 콘텐츠예요.
						</p>
					)}
				</>
			)}
		</div>
	);
}

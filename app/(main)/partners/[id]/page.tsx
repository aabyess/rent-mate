// app/(main)/partners/[id]/page.tsx
import type { JSX } from "react";
import { PartnerDetail } from "@/features/partners/components/PartnerDetail";

type PartnerDetailPageProps = {
	params: Promise<{ id: string }>;
};

export default async function PartnerDetailPage({
	params,
}: PartnerDetailPageProps): Promise<JSX.Element> {
	const { id } = await params;
	return <PartnerDetail profileId={id} />;
}

-- supabase/migrations/20260821203200_report_resolved_dedupe_exclusion.sql
-- report_resolved도 partner_approved/rejected/payout_released와 같은 이유로 dedup 제외:
-- payload가 {reportId}라 dedupe 키(bookingId)가 항상 null이고, null은 유니크 인덱스에서
-- 서로 다른 값 취급돼 사실상 무의미하게 통과된다 — 의도를 명시하기 위해 제외 목록에 넣는다.

drop index public.notifications_dedupe_idx;

create unique index notifications_dedupe_idx
	on public.notifications (type, (payload ->> 'bookingId'), recipient_id)
	where type not in ('partner_approved', 'partner_rejected', 'payout_released', 'report_resolved');

-- supabase/migrations/20260820210100_partner_approval_dedupe_index.sql
-- partner_approved/partner_rejected는 대상이 예약이 아니라 그 사람 고유값(partnerId)이라,
-- 기존 (type, bookingId, recipient) 유니크 인덱스에 partnerId를 끼워 넣으면 거절→재신청→재승인
-- 시나리오에서 두 번째 승인 알림이 "중복"으로 영구 억제된다. 그래서 이 두 타입만 dedupe
-- 대상에서 제외하는 partial index로 바꾼다 — admin 버튼 클릭 1회당 1건이라 이미 Button
-- isLoading으로 더블클릭이 막혀있어 dedup 없이도 낮은 빈도·낮은 심각도다 ([스키마 협의] 완료).

drop index public.notifications_dedupe_idx;

create unique index notifications_dedupe_idx
	on public.notifications (type, (payload ->> 'bookingId'), recipient_id)
	where type <> 'partner_approved' and type <> 'partner_rejected';

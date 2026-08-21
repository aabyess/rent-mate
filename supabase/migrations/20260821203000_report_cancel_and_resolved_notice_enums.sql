-- supabase/migrations/20260821203000_report_cancel_and_resolved_notice_enums.sql
-- 신고 피드백 루프 1단계: enum 값 추가만. 같은 트랜잭션에서 새 값을 참조하는
-- 정책/트리거/인덱스는 각각 별도 파일(203100, 203200)로 분리한다 —
-- ALTER TYPE ... ADD VALUE는 같은 트랜잭션 내에서 그 값을 참조하는 다른
-- 문장과 함께 쓸 수 없다.

-- 신고자 본인이 열람 중(open)인 신고를 취소할 수 있게 — 하드 삭제 대신
-- 상태로 남겨서 안전센터 신고내역에 감사 추적이 남는다.
alter type public.report_status add value 'canceled';

-- 신고 처리(조치 완료/기각) 시 신고자에게 알리는 알림 타입.
alter type public.notification_type add value 'report_resolved';

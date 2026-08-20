-- supabase/migrations/20260820170000_partner_body_specs.sql
-- 파트너 신체 조건(키·몸무게) — 선택 입력. 프로필 카드가 아닌 상세에서만 절제해
-- 노출한다 (외모 평가 프레임 강조는 성인 서비스 연상 리스크 — 디자인 가이드 방침).

alter table public.partner_profiles
	add column height_cm integer check (height_cm between 130 and 220),
	add column weight_kg integer check (weight_kg between 30 and 150);

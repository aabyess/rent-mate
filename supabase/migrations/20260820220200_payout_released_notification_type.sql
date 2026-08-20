-- supabase/migrations/20260820220200_payout_released_notification_type.sql
alter type public.notification_type add value 'payout_released';

-- ==============================================================================
-- SKEMA DATABASE SUPABASE: UNDANGAN DIGITAL (SITI AMI & ABDUL AZIS)
-- ==============================================================================
-- Petunjuk:
-- 1. Buka dashboard project Supabase Anda di https://supabase.com
-- 2. Klik menu "SQL Editor" di bilah kiri, lalu klik "New query"
-- 3. Salin (copy) dan tempel (paste) seluruh query di bawah ini, lalu klik "Run" (atau Ctrl+Enter)
-- ==============================================================================

-- 1. Buat Tabel rsvp_wishes jika belum ada
CREATE TABLE IF NOT EXISTS public.rsvp_wishes (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    attendance TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.rsvp_wishes ENABLE ROW LEVEL SECURITY;

-- 3. Hapus policy lama jika ada (agar bersih dan tidak duplikat)
DROP POLICY IF EXISTS "Public can view all wishes" ON public.rsvp_wishes;
DROP POLICY IF EXISTS "Public can insert wish" ON public.rsvp_wishes;
DROP POLICY IF EXISTS "Public can delete wish" ON public.rsvp_wishes;

-- 4. Policy: Izinkan semua pengunjung membaca ucapan (SELECT)
CREATE POLICY "Public can view all wishes" 
ON public.rsvp_wishes 
FOR SELECT 
USING (true);

-- 5. Policy: Izinkan semua tamu mengirim ucapan & konfirmasi kehadiran (INSERT)
CREATE POLICY "Public can insert wish" 
ON public.rsvp_wishes 
FOR INSERT 
WITH CHECK (true);

-- 6. Policy: Izinkan penghapusan untuk admin pengantin (DELETE)
CREATE POLICY "Public can delete wish" 
ON public.rsvp_wishes 
FOR DELETE 
USING (true);

-- 7. Tambahkan data awal (default contoh ucapan)
INSERT INTO public.rsvp_wishes (name, attendance, message, created_at)
VALUES 
  (
    'Bpk. Supangat (Kepala Desa Sentul)',
    'Hadir (2 Orang)',
    'Selamat atas pernikahan Siti Ami & Abdul Azis, serta khitanan ananda Andiks Satria & Raditya Panca. Semoga kedua mempelai menjadi keluarga sakinah mawaddah warahmah dan ananda tumbuh menjadi anak sholeh yang membanggakan.',
    NOW() - INTERVAL '2 hours'
  ),
  (
    'Bpk. Azwar Anas, S.T., M.I.Kom',
    'Hadir (1 Orang)',
    'Barakallahu lakuma wa baraka alaikuma wa jama''a bainakuma fii khoir. Turut berbahagia untuk kedua keluarga besar di Kp. Buah Gede.',
    NOW() - INTERVAL '4 hours'
  ),
  (
    'Keluarga Besar Kp. Buah Gede',
    'Hadir (4 Orang)',
    'Selamat menempuh hidup baru Ami & Azis! Selamat juga buat Andiks & Raditya atas khitanannya, semoga lekas pulih dan menjadi kebanggaan orang tua.',
    NOW() - INTERVAL '6 hours'
  )
ON CONFLICT DO NOTHING;

-- 8. Aktifkan Realtime Replication (agar ucapan muncul seketika tanpa refresh)
ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvp_wishes;


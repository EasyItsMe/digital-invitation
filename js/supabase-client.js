/**
 * ==============================================================================
 * SUPABASE CLOUD DATABASE CLIENT (RSVP SYNC ENGINE)
 * ==============================================================================
 * Mengelola penyimpanan & sinkronisasi kehadiran serta ucapan buku tamu
 * secara online real-time antar-perangkat di Supabase & Vercel.
 * ==============================================================================
 */

(function (window) {
  'use strict';

  // Konfigurasi Supabase
  // Anda bisa mengisi URL & Anon Key langsung di sini, atau lewat menu Pengaturan di admin.html
  const CONFIG = {
    URL: window.__SUPABASE_URL__ || localStorage.getItem('app_supabase_url') || '',
    ANON_KEY: window.__SUPABASE_ANON_KEY__ || localStorage.getItem('app_supabase_anon_key') || '',
    TABLE: 'rsvp_wishes'
  };

  const DEFAULT_SEED_WISHES = [
    {
      id: 1,
      name: "Bpk. Supangat (Kepala Desa Sentul)",
      attendance: "Hadir (2 Orang)",
      message: "Selamat atas pernikahan Siti Ami & Abdul Azis, serta khitanan ananda Andiks Satria & Raditya Panca. Semoga kedua mempelai menjadi keluarga sakinah mawaddah warahmah dan ananda tumbuh menjadi anak sholeh yang membanggakan.",
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    },
    {
      id: 2,
      name: "Bpk. Azwar Anas, S.T., M.I.Kom",
      attendance: "Hadir (1 Orang)",
      message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir. Turut berbahagia untuk kedua keluarga besar di Kp. Buah Gede.",
      created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    },
    {
      id: 3,
      name: "Keluarga Besar Kp. Buah Gede",
      attendance: "Hadir (4 Orang)",
      message: "Selamat menempuh hidup baru Ami & Azis! Selamat juga buat Andiks & Raditya atas khitanannya, semoga lekas pulih dan menjadi kebanggaan orang tua.",
      created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
    }
  ];

  let supabaseInstance = null;

  function initClient() {
    const url = CONFIG.URL.trim();
    const key = CONFIG.ANON_KEY.trim();

    if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supabaseInstance = window.supabase.createClient(url, key);
        return supabaseInstance;
      } catch (e) {
        console.warn('Gagal inisialisasi Supabase client:', e);
      }
    }
    return null;
  }

  // Coba inisialisasi awal
  initClient();

  const SupabaseRSVP = {
    isConfigured: function () {
      return !!(CONFIG.URL && CONFIG.ANON_KEY && supabaseInstance);
    },

    getConfig: function () {
      return {
        url: CONFIG.URL,
        anonKey: CONFIG.ANON_KEY,
        isConfigured: this.isConfigured()
      };
    },

    saveCredentials: function (url, key) {
      if (url) localStorage.setItem('app_supabase_url', url.trim());
      else localStorage.removeItem('app_supabase_url');

      if (key) localStorage.setItem('app_supabase_anon_key', key.trim());
      else localStorage.removeItem('app_supabase_anon_key');

      CONFIG.URL = url ? url.trim() : '';
      CONFIG.ANON_KEY = key ? key.trim() : '';
      initClient();
      return this.isConfigured();
    },

    formatTimeAgo: function (dateStr) {
      if (!dateStr) return 'Baru saja';
      try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      } catch (e) {
        return 'Baru saja';
      }
    },

    // 1. Ambil seluruh data ucapan
    fetchWishes: async function () {
      // Prioritas 1: Client-side Supabase langsung
      if (this.isConfigured() && supabaseInstance) {
        try {
          const { data, error } = await supabaseInstance
            .from(CONFIG.TABLE)
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            // Backup ke localStorage
            localStorage.setItem('ami_azis_wishes_v2', JSON.stringify(data));
            return { success: true, source: 'supabase', data: data };
          }
        } catch (e) {
          console.warn('Supabase direct query failed, trying API/local fallback:', e);
        }
      }

      // Prioritas 2: Vercel Serverless Function (/api/rsvp)
      try {
        const res = await fetch('/api/rsvp');
        if (res.ok) {
          const json = await res.json();
          if (json.configured && Array.isArray(json.data)) {
            localStorage.setItem('ami_azis_wishes_v2', JSON.stringify(json.data));
            return { success: true, source: 'vercel_api', data: json.data };
          }
        }
      } catch (e) {
        // Abaikan jika offline / bukan di Vercel
      }

      // Prioritas 3: LocalStorage Fallback
      try {
        const stored = localStorage.getItem('ami_azis_wishes_v2');
        const list = stored ? JSON.parse(stored) : DEFAULT_SEED_WISHES;
        return { success: true, source: 'local', data: list };
      } catch (e) {
        return { success: true, source: 'default', data: DEFAULT_SEED_WISHES };
      }
    },

    // 2. Kirim ucapan / RSVP baru
    submitWish: async function (wishData) {
      const payload = {
        name: wishData.name.trim(),
        attendance: wishData.attendance ? wishData.attendance.trim() : 'Hadir',
        message: wishData.message.trim(),
        created_at: new Date().toISOString()
      };

      let insertedData = null;

      // Prioritas 1: Supabase Direct
      if (this.isConfigured() && supabaseInstance) {
        try {
          const { data, error } = await supabaseInstance
            .from(CONFIG.TABLE)
            .insert([payload])
            .select();

          if (!error && data && data.length > 0) {
            insertedData = data[0];
          }
        } catch (e) {
          console.warn('Supabase insert failed:', e);
        }
      }

      // Prioritas 2: Vercel Serverless Function
      if (!insertedData) {
        try {
          const res = await fetch('/api/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const json = await res.json();
            if (json.configured && json.data) {
              insertedData = json.data;
            }
          }
        } catch (e) {}
      }

      // Selalu simpan di LocalStorage sebagai cache
      try {
        const currentRes = await this.fetchWishes();
        let list = currentRes.data || [];
        const itemToSave = insertedData || Object.assign({ id: Date.now() }, payload);
        list = [itemToSave, ...list.filter(w => w.id !== itemToSave.id)];
        localStorage.setItem('ami_azis_wishes_v2', JSON.stringify(list));
      } catch (e) {}

      return {
        success: true,
        source: insertedData ? (supabaseInstance ? 'supabase' : 'vercel_api') : 'local',
        data: insertedData || payload
      };
    },

    // 3. Hapus ucapan (khusus admin)
    deleteWish: async function (wishItem) {
      const wishId = wishItem.id;

      // Hapus dari Supabase jika ada id
      if (this.isConfigured() && supabaseInstance && wishId) {
        try {
          await supabaseInstance.from(CONFIG.TABLE).delete().eq('id', wishId);
        } catch (e) {}
      } else if (wishId) {
        try {
          await fetch(`/api/rsvp?id=${wishId}`, { method: 'DELETE' });
        } catch (e) {}
      }

      // Hapus dari LocalStorage
      try {
        const stored = localStorage.getItem('ami_azis_wishes_v2');
        if (stored) {
          let list = JSON.parse(stored);
          list = list.filter(w => {
            if (wishId && w.id) return w.id !== wishId;
            return !(w.name === wishItem.name && w.message === wishItem.message);
          });
          localStorage.setItem('ami_azis_wishes_v2', JSON.stringify(list));
        }
      } catch (e) {}

      return { success: true };
    },

    // 4. Real-time Subscription (WebSocket Supabase)
    subscribeRealtime: function (callback) {
      if (this.isConfigured() && supabaseInstance) {
        try {
          const channel = supabaseInstance
            .channel('rsvp-live-feed')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: CONFIG.TABLE },
              payload => {
                if (typeof callback === 'function') {
                  callback(payload);
                }
              }
            )
            .subscribe();
          return channel;
        } catch (e) {
          console.warn('Realtime subscription error:', e);
        }
      }
      return null;
    }
  };

  window.SupabaseRSVP = SupabaseRSVP;
})(window);

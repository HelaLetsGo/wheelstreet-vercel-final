
# 🚀 Wheelstreet – Vercel Ready Project

Šitas projektas paruoštas deploy'ui per [Vercel](https://vercel.com) arba [Replit](https://replit.com).

## ✅ Kaip paleisti per Vercel

1. Nueik į [https://vercel.com/import/git](https://vercel.com/import/git)
2. Pasirink šį GitHub repozitoriją arba įkelk šį projektą kaip ZIP
3. Vercel automatiškai aptiks Next.js
4. Kai deploy bus baigtas, nueik į `Settings > Environment Variables` ir pridėk:

```
NEXT_PUBLIC_SUPABASE_URL = tavo-url
NEXT_PUBLIC_SUPABASE_ANON_KEY = tavo-key
```

5. Spausk **Redeploy**
6. Svetainė bus pasiekiama pvz.: `https://wheelstreetfinal.vercel.app`

---

## 💡 Svarbu
- Įsitikink, kad `app/page.tsx` egzistuoja (tai tavo pagrindinis puslapis)
- Jeigu kažkas neveikia – kreipkis!


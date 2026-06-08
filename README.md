# ⚽ VM 2026 Tipset

En tippningsapp för VM 2026 — tippa alla gruppspelsmatcher och tävla om bäst highscore!

## Funktioner
- Tippa exakt resultat (2p) eller rätt utgång (1p)
- Tips låses automatiskt 11 juni 2026 kl 19:00 CET
- Highscore-lista i realtid
- Adminsida för att mata in resultat
- Funkar på mobil och dator

---

## Setup — steg för steg

### Steg 1: Klona/kopiera projektet
```bash
cd vm-tipset
npm install
```

### Steg 2: Skapa Supabase-projekt (gratis)
1. Gå till [supabase.com](https://supabase.com) → skapa ett konto
2. Klicka **New project** → välj ett namn (t.ex. `vm-tipset-2026`)
3. Välj region **EU West** (Frankfurt)
4. Välj ett databaslösenord → **Spara det!**
5. Vänta ~2 min tills projektet är klart

### Steg 3: Skapa databastabellerna
1. I Supabase: gå till **SQL Editor** i vänstermenyn
2. Klicka **New query**
3. Kopiera hela innehållet från `supabase_schema.sql`
4. Klistra in och klicka **Run**
5. Du ska se "Success. No rows returned."

### Steg 4: Hämta dina API-nycklar
1. I Supabase: gå till **Settings** → **API**
2. Kopiera **Project URL** (ser ut som `https://abc123.supabase.co`)
3. Kopiera **anon public** key (lång sträng)

### Steg 5: Skapa .env-filen
```bash
cp .env.example .env
```
Öppna `.env` och fyll i:
```
VITE_SUPABASE_URL=https://ditt-projekt-id.supabase.co
VITE_SUPABASE_ANON_KEY=din-anon-nyckel
VITE_ADMIN_PASSWORD=välj-ett-lösenord
```

### Steg 6: Testa lokalt
```bash
npm run dev
```
Öppna [http://localhost:5173](http://localhost:5173)

---

## Deploy till Vercel (gratis hosting)

### Alternativ A: Via GitHub (rekommenderas)
1. Skapa ett nytt privat repo på GitHub
2. Pusha koden:
```bash
git init
git add .
git commit -m "VM Tipset 2026"
git branch -M main
git remote add origin https://github.com/DITT-NAMN/vm-tipset.git
git push -u origin main
```
3. Gå till [vercel.com](https://vercel.com) → logga in med GitHub
4. Klicka **Add New Project** → välj ditt repo
5. Under **Environment Variables** — lägg till:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
6. Klicka **Deploy** — klart! Du får en länk att dela med alla.

---

## Adminsidan
- Logga in med ditt namn + kryssa i "Logga in som admin" + skriv in adminlösenordet
- Gå till **Admin**-fliken
- Välj grupp och mata in resultat efter varje match
- Highscore uppdateras direkt för alla

---

## Poängsystem
| Träff | Poäng |
|-------|-------|
| Exakt rätt resultat (t.ex. 2–1) | 2p |
| Rätt utgång (vinst/oavgjort) | 1p |
| Fel | 0p |

---

## Teknikstack
- **React** + Vite
- **Supabase** (databas + API)
- **Vercel** (hosting)

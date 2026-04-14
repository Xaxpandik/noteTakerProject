# NotesApp — Poznámková aplikace s rich-text editorem

Tato aplikace je webový nástroj pro správu poznámek vytvořený v Next.js. Obsahuje bezpečné přihlašování, rich-text editor BlockNote s podporou zvýrazňování syntaxe (TypeScript atd.) a možnost exportu i importu dat.

## Požadavky a instalace

Pro spuštění aplikace budete potřebovat:
- **Node.js** (verze 18.x nebo novější)
- **npm** (přibalen k Node.js)
- **PostgreSQL** databázi (běžící lokálně nebo v cloudu, přidán docker compose)

### Kroky k instalaci:

1. **Klonování repozitáře:**
   ```bash
   git clone <url-repozitare>
   cd notesapp
   ```

2. **Instalace závislostí:**
   ```bash
   npm install
   ```

## Nastavení prostředí (.env)

Aplikace vyžaduje několik konfiguračních vars. Pro začátek zkopírujte vzorový soubor:

```bash
cp .env.example .env
```

V souboru `.env` upravte následující (viz `.env.example` pro inspiraci):
- `DATABASE_URL`: URL vaší PostgreSQL databázi.
- `NEXTAUTH_SECRET`: Náhodný string pro zabezpečení sessions.
- `NEXTAUTH_URL`: `http://localhost:3000` pro lokální vývoj.

## Migrace a spuštění

Před prvním spuštěním je nutné připravit databázi a nahrát ukázková data.

1. **Synchronizace databázového schématu:**
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Nahrání ukázkových dat (Seeding):**
   Tento příkaz vytvoří demo uživatele a několik počátečních poznámek.
   ```bash
   npm run seed
   ```

3. **Spuštění aplikace v development módu:**
   ```bash
   npm run dev
   ```
   Aplikace bude dostupná na `http://localhost:3000`.

## Demo uživatel

Pro rychlé vyzkoušení aplikace použijte po spuštění seed skriptu tyto údaje:
- **Uživatelské jméno:** `demo`
- **Heslo:** `ABCabc123`

## Export a Import poznámek

Aplikace umožňuje snadný přenos dat ve formátu JSON.

### Export dat:
- **Všechny poznámky:** Klikněte na tlačítko "Export" na hlavní stránce nebo navštivte API endpoint `/api/notes/export`.
- **Jednotlivé poznámky:** Na stránce detailu konkrétní poznámky je k dispozici tlačítko pro export dané položky.

### Import dat:
- Přejděte na stránku **Import** (`/notes/import`) přes horní menu.
- Sem můžete nahrát nebo vložit JSON soubor s poznámkami. Aplikace automaticky rozpozná formát a přidá poznámky k vašemu účtu.

---
*Vytvořeno jako školní projekt.*

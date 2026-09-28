# TPT Disk Cleanup Pro — Build Todo

> Hub listing: `tptsolutions.co.nz/tools/diskclean-pro` (registry slug
> `diskclean-pro`, category `utility`). Spec: `apps.md` §T2-3 in the
> `tpt-electrician-nz-2` repo. Base is `tpt-diskview` (at
> `Open Source\tpt-diskview` — Rust + Tauri + Solid). Desktop-only (needs
> real filesystem access) — no in-browser demo; the free/paid split is two
> separate downloadable builds instead of a WASM demo + Gumroad exe.

## Status: builds fixed & verified, installers produced — Gumroad publish is the remaining manual step

**2026-09-26: the interactive test found the previously shipped exes were
broken and fixed five real bugs (see "Bugs found & fixed" below). The
2026-09-19 zips — including the one deployed to the web repo — contained
exes that could never render their UI. Treat all earlier "verified" notes
in this file with that in mind.**

## Design principles (user directive, 2026-09-26)

- **No deletion without explicit approval.** Every destructive action
  requires: user ticks items (report or cleanup panel) → Review Selection →
  explicit confirm screen ("Move to Recycle Bin") → deletion via the
  Recycle Bin only. Nothing automatic, nothing pre-selected. An opt-in
  "automatic cleanup" mode remains a possible v1.1 feature, off by default.
- **Post-scan report first.** After a scan the user gets a browsable report
  at drive → folder → file level (Report tab + sidebar tree), and chooses
  what to act on per item.

## Phase 0–1 — Base repo & free/Pro split (done earlier, re-verified)

- [x] `tpt-diskview` cloned, builds clean.
- [x] `pro` Cargo feature gates `cleanup_selected`: free build always
      refuses to delete (compile-time, not UI-level); frontend surfaces the
      refusal as an upsell banner linking to the hub page. Re-verified on
      the final build: free exe shows the banner and deletes nothing.

## Phase 2 — Packaging

- [x] Frontend built (`pnpm build` → `dist/`).
- [x] **Installers**: NSIS + MSI for both editions via
      `cargo tauri build -b nsis,msi -c src-tauri/tauri.{free,pro}.conf.json`
      (overlay configs give distinct product names/identifiers so the two
      editions don't collide as one Windows product; tauri CLI auto-downloads
      NSIS/WiX). Staged in `tpt-diskview\release\` as
      `TPT-DiskClean-{Free,Pro}-Setup.exe` and `-Installer.msi`.
      Code signing: still none (no cert) — the exes/installers are
      unsigned; SmartScreen will warn until a cert is bought.
- [x] Plain-exe zips rebuilt from working binaries:
      `TPT-DiskClean-{Free,Pro}.zip` (exe + README).

## Phase 3 — Ship & measure

- [x] Free edition deployed as a static download in the web repo
      (`tpt-electrician-nz-2\public\apps\diskclean-pro\`). **The 2026-09-19
      deploy was broken** (see bugs); replaced with the fixed zip.
- [x] Registry entry (`tpt-apps-registry.ts`): `kind: 'download-only'`,
      `freeDownloadUrl` (new field + render branch in the tools page).
- [x] Verified in dev: `/tools/diskclean-pro` (200), zip download (200),
      hub card + detail page render.
- [ ] Gumroad product from `GUMROAD.md`, URL + price into the registry —
      **manual (needs user's Gumroad login)**; cover images are ready in
      `gumroad-assets/`.
- [x] Interactive test of the Pro exe's cleanup flow — done 2026-09-26 via
      scripted UI automation (CDP) against a sandbox folder
      (`C:\Users\phill\tpt-clean-test`) containing only self-created marker
      files. Full chain verified: scan → report → tick → review → confirm →
      Recycle Bin (markers recoverable in bin, keeper files untouched).
      The confirm screen was also reached and deliberately NOT clicked in
      the final verification pass — sign-off on a real deletion stays with
      the user.

## Bugs found & fixed (2026-09-26 interactive test) — all in `tpt-diskview`

1. **Shipped exes pointed at the dev server.** Plain `cargo build` never
   enables `tauri/custom-protocol`, so the frontend wasn't embedded: every
   staged exe showed "localhost refused to connect". Build only via
   `cargo tauri build` (GUMROAD.md updated). The deployed free zip had the
   same defect.
2. **Scan deadlock.** `start_scan` held the `scan_state` mutex across
   `scanner.start()`, and the scan's progress callback re-locks it — every
   scan froze forever on "Starting scan...". The app had never completed a
   scan.
3. **Scan never "completed"** even without the deadlock: `Scanner::start`
   returns the tree but the command discarded it and the scanner never
   emits `Completed`. UI stayed on "Scanning..." forever.
4. **Quadratic scan** (found via the C:\ test): `scan_path` walked each
   directory's whole subtree and used only depth-1 entries — the entire
   disk was re-walked at every level. Fixed to depth-1 walks.
5. **WebView OOM crash on real disks**: `scan_status` cloned + serialized
   the whole (partial) tree to the UI 10×/sec — a 3.7M-entry C:\ scan
   crashed the app in ~3 minutes. Now the poll returns counters only and
   the UI fetches the tree **per level** (`get_node_children`); the scan
   tree lives Rust-side. Verified: full C:\ scan (1.97 TB, 3.76M items)
   completes, browsable, no crash.
6. Minor: `Cache`/`cache` patterns double-listed candidates on Windows
   (case-insensitive) — deduped.

## New since the original spec (user directive)

- **Report view** (default tab): browsable table per level — name, size,
  % of parent, items, modified — with per-item tick boxes feeding the
  existing review → confirm → Recycle Bin flow (`Review Cleanup…`).
  Sidebar tree is now a lazy-expand navigator.
- Verified on a real disk: full C:\ scan → report at drive/folder/file
  levels, treemap + sunburst per folder, all from the lazy per-level API.

## Known v1.1 items (not silent cuts)

- Scheduling + startup manager from the original apps.md spec (unchanged).
- Rust-side memory during huge scans (~1.6 GB for 3.76M entries) —
  fine for client PCs, could be slimmed.
- Optional opt-in "automatic cleanup" mode (off by default) per the
  approval directive.
- Code signing cert.
- `pnpm lint` is broken in `tpt-diskview` (eslint 9 config migration), and
  the app still brands itself `tpt-diskview` in-header/window-title of the
  plain builds — cosmetic.

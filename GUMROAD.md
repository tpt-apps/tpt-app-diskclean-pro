# Gumroad listing

Everything needed to create/update the Gumroad product. Source copy is
`apps.md` §T2-3 in the `tpt-electrician-nz-2` repo — if that changes, update
here too (and vice versa).

**Note on where the actual code lives:** unlike most `tpt-app-*` repos, this
app doesn't have its own Rust/WASM build — `tpt-diskview` (a separate,
already-substantial repo: Rust + Tauri + Solid) *is* the product. This repo
is just the Gumroad/registry wrapper. Both editions are built directly from
`tpt-diskview`:

```
cd tpt-diskview
# free edition: exe + NSIS/MSI installers
cargo tauri build -b nsis,msi -c src-tauri/tauri.free.conf.json
# pro edition
cargo tauri build --features pro -b nsis,msi -c src-tauri/tauri.pro.conf.json
# plain exe only (for re-staging the zips), e.g.:
cargo tauri build --no-bundle -c src-tauri/tauri.free.conf.json
```

**Do NOT build with plain `cargo build`** — without the tauri CLI the
`tauri/custom-protocol` feature is never enabled, so the frontend assets are
not embedded and the exe ships pointing at the Vite dev server
(`http://localhost:1420`), showing "can't reach this page" for every user.
This is exactly how the first (broken) set of zips was produced on 2026-09-19.

The `pro` Cargo feature gates `cleanup_selected` (the one real destructive
command — everything else is scan/report-only): the free build compiles the
same command but it always refuses to delete anything, so there's no risk of
the free edition accidentally shipping with cleanup enabled.

Deletion itself is two-step by design (select/review, then an explicit
confirm), always goes to the Recycle Bin, and never happens automatically —
see todo.md's approval note.

## Step-by-step: publish this listing

1. Built — `tpt-diskview\release\TPT-DiskClean-Pro.zip` is ready to upload
   as-is. (Rebuild both editions per the note above, re-stage, and re-zip
   before every price/content change.)
2. Log in to Gumroad → **New product** → **Digital product**.
3. Set the product name, price, and upload the packaged file (all below).
4. Paste the short description, bullets, and full description (below) into
   their respective fields.
5. Set category/tags (below) and add a cover image (see note below).
6. Publish, then copy the resulting product URL (`https://gum.co/...`).
7. Paste that URL into the `diskclean-pro` entry's `gumroadUrl` field in
   `tpt-electrician-nz-2\src\lib\tpt-apps-registry.ts`, and set `price: '$29'`
   on the same entry.
8. Confirm `status` is `'live'` (it already is — the free download shipped
   first).
9. Commit and push the registry repo.

## File to upload

```
tpt-diskview\release\TPT-DiskClean-Pro.zip
```

## Price

**$29 USD, one-time purchase — technician license** (covers unlimited client
machines, not per-install).

## Short description / summary field

```
No bundled adware, no telemetry, no upsell nagging — built for technicians who need to trust what they run on a client's machine. One license, unlimited client PCs.
```

## Bullets / feature list

```
Technician license, unlimited machines
Zero bundled ads/telemetry
Fast parallel disk scan with treemap/sunburst/report views
Post-scan report: browse drive, folder and file levels, tick exactly what to clean
Duplicate file & stale Docker volume detection
Deletions only ever happen on explicit review + confirm, into the Recycle Bin
One-time purchase
```

## Full description (long-form field)

```
TPT Disk Cleanup Pro scans your disk fast (parallel filesystem traversal,
treemap/sunburst/tree views), finds temp files, browser caches,
duplicates, and stale Docker volumes, and actually clears them — with zero
bundled upsells, telemetry, or "upgrade to remove ads" friction.

Who it's for: IT support technicians and solo MSPs who clean up client PCs
for a living, wary of CCleaner's post-Avast reputation (bundled upsell
nagging, a 2017 supply-chain malware incident, browser-extension bloat).

Pro edition (this download) — sold as a technician license:
- Full cleanup actions (the free edition can scan and preview but never
  deletes anything — try it risk-free first)
- Usable on unlimited client PCs under one license

Try the free scan-only edition first (no signup, no time limit):
tptsolutions.co.nz/tools/diskclean-pro

Requirements: Windows 10 (20H2+) or Windows 11. Uses the WebView2 runtime,
preinstalled on both — nothing extra to download.
```

## Category / tags

- Category: **Software > Utility** (or Gumroad's closest equivalent)
- Tags: `disk-cleanup`, `pc-maintenance`, `it-tools`, `msp-tools`,
  `system-utility`, `windows`

## Cover image / thumbnail

Created from a real scan (no stock/AI art): see `gumroad-assets/` in this
repo — `cover-1280x720.png` (Gumroad thumbnail, cropped from the treemap of
a real C:\ scan) plus `sunburst.png` / `report.png` as extra listing shots.
To re-shoot after a UI change: launch the pro exe, scan C:\, switch views,
capture the WebView viewport (1200x800+ window), then crop to 1280x720.

## After publishing

1. Copy the resulting product URL (`https://gum.co/...`).
2. Paste it into the `gumroadUrl` field of the `diskclean-pro` entry in
   `tpt-electrician-nz-2\src\lib\tpt-apps-registry.ts`, and set `price: '$29'`.
3. Confirm `status` is `'live'`.
4. Commit and push the registry repo.

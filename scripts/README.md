# Scripts

Project automation scripts

## welcome-updater

Updates `welcome.html` preset list from `config/presets/` directory.

Self-contained bash script with embedded Python implementation.

**Usage:**

```bash
./scripts/welcome-updater
```

**Function:**
- Scans `config/presets/` for all `.json` files
- Generates `config/presets/manifest.json`
- Updates `welcome.html` between marker comments
- Sorts presets: init files first, then alphabetically
- Generates Editor and Player links for each preset

**Dynamic Loading:**

The welcome page includes a "Refresh" button that reloads the preset list from `manifest.json` without page reload. After adding new presets:

1. Run `./scripts/welcome-updater` to update manifest
2. Click "Refresh" button on welcome page

**When to run:**
- After adding a new preset
- After deleting a preset
- After renaming a preset file

**VS Code Integration:**

Run the script directly from VS Code:
1. Open Command Palette: ⇧⌘P (Mac) / Ctrl+Shift+P (Windows/Linux)
2. Type: `Tasks: Run Task`
3. Select: `Update Welcome Page Presets`

See `.vscode/README.md` for more details.

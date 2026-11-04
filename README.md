# Done

**Definitely One** — Your ecosystem platform.

A cross-platform desktop application built with [Tauri v2](https://tauri.app), React, and TypeScript.

## Platforms

| Platform | Architecture | Installer |
|----------|-------------|-----------|
| macOS | Apple Silicon (aarch64) | `.dmg` |
| macOS | Intel (x86_64) | `.dmg` |
| Windows | x64 | `.msi` / `.exe` |

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Rust](https://rustup.rs/)
- [Tauri Prerequisites](https://tauri.app/start/prerequisites/)

### Setup

```bash
# Install dependencies
npm install

# Start dev server (opens the app with hot reload)
npm run tauri dev

# Build for production
npm run tauri build
```

## Releases

Releases are automated via GitHub Actions. To create a new release:

```bash
# Tag a new version
git tag v0.1.0
git push origin v0.1.0
```

This triggers the release workflow which:
1. Creates a draft GitHub Release
2. Builds native binaries on macOS and Windows runners
3. Uploads installers to the release
4. Publishes the release

### Auto-Updates

The app includes built-in auto-update support via the Tauri Updater plugin. Users are notified when a new version is available.

## Project Structure

```
Done/
├── src/                    # React frontend
│   ├── pages/              # Page components
│   ├── App.tsx             # Root component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles (Tailwind)
├── src-tauri/              # Tauri/Rust backend
│   ├── src/
│   │   ├── lib.rs          # App logic & Tauri commands
│   │   └── main.rs         # Entry point
│   ├── capabilities/       # Permission definitions
│   ├── icons/              # App icons
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── .github/workflows/      # CI/CD
│   ├── ci.yml              # PR checks
│   └── release.yml         # Release builds
└── package.json            # Frontend dependencies
```

## License

MIT

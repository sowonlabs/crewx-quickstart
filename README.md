# SowonAI CrewX Quickstart CLI

Generate a ready-to-run CrewX workspace in under 30 seconds:

```bash
npx crewx-quickstart
crewx q "@quickstart hi"
```

The first command scaffolds the required configuration files, Slack helper script, and documentation. The second command talks to the freshly provisioned `@quickstart` agent powered by the CrewX CLI (assumed to be installed).

## Features

- ✨ **Zero-friction setup** – copy-and-edit `crewx.yaml` with helpful comments
- 🤖 **Custom agent included** – `@quickstart` is configured for immediate use
- 💬 **Slack ready** – `.env.slack` placeholder + executable `start-slack.sh`
- 📝 **Guided documentation** – README outlines next actions and tips
- 🛡️ **Safe overwrites** – existing files are preserved unless `--force` is passed

## Usage

```
npx crewx-quickstart [target-dir]
```

If `target-dir` is omitted, files are written into the current directory. The CLI will:

1. Create `crewx.yaml`, `.env.slack`, `start-slack.sh`, `.gitignore`, and `README.md`
2. Skip existing files unless you pass `--force`
3. Print the two follow-up commands (`crew` query + optional Slack launch)

### Flags

- `--force`, `-f` – overwrite existing files
- `--quiet`, `-q` – suppress per-file logs (only success/failure output)

## Development

```bash
# Install dependencies (none required right now)
npm install

# Run the CLI locally
node bin/crewx-quickstart.js demo-project
```

## License

MIT © Sowon Labs

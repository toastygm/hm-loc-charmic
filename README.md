# HârnWorld Location Module: Charmic Manor
[![Version (latest)](https://img.shields.io/github/v/release/toastygm/hm-loc-charmic)](https://github.com/toastygm/hm-loc-charmic/releases/latest)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fhm-loc-charmic&colorB=4aa94a)](https://forge-vtt.com/bazaar#package=hm-loc-charmic)
[![GitHub downloads (latest)](https://img.shields.io/badge/dynamic/json?label=Downloads@latest&query=assets[?(@.name.includes('zip'))].download_count&url=https://api.github.com/repos/toastygm/hm-loc-charmic/releases/latest&color=green)](https://github.com/toastygm/hm-loc-charmic/releases/latest)

![Charmic Village](assets/images/charmic-village.webp)

Charmic Manor is a "Location Module" for the Foundry VTT system. This location module
is designed to depict the Charmic Manor in the far north of the Kingdom of Kaldor, on
the island of Hârn in the [HârnWorld](https://columbiagames.com/harnworld/) fantasy
setting; however, this manor could be adapted to exist anywhere in any fantasy setting.

Although designed for use with the [HârnMaster](https://foundryvtt.com/packages/hm3)
system, this module is mostly system-agnostic.  Detailed descriptions of the actors
has been provided in journal entries to facilitate conversion to other game systems.

This manor is held directly by the Earl of Neph and managed by a bailiff. It is a
relatively new manor with huge potential, and grew very prosperous under its
original bailiff. But in recent years, it has become a dark and dangerous place. 

# Maps

The original maps from this work have been used as inspiration, and new maps have been
designed specifically to meet the requirements of the VTT environment.  The following
maps are part of this module.

## Charmic Village

Map of Charmic Village, including the manor.

<img src="assets/scenes/village-map.webp" alt="Charmic Village" width="600"/>

## Timberwright's Yard

<img src="assets/scenes/timberwrights-yard.webp" alt="Timberwright's Yard" width="600"/>

## Charmic Manor

<img src="assets/scenes/charmic-manor.webp" alt="Charmic Manor" width="600"/>

# Credits

This module is made possible by the hard work of HârnWorld fans,
and is provided at no cost. This work is an adaptation of the article
[Charmic Manor]()https://www.lythia.com/harnworld/settlements/charmic/ available
at the HârnWorld fan site [Lythia.com](https://www.lythia.com/).

**Writer:** Kerry Mould

**Original Maps:** Patrick Nilsson

**Artist:** Richard Luschek

**Adapted to Foundry VTT:** Tom Rodriguez

This module is "[Fanon](https://www.lythia.com/about/publishing-fan-written-material/)",
a derivative work of copyrighted material by Columbia Games Inc. and N. Robin Crossby.

Some assets used to create the maps in this module are from
[Forgotton Adventures](https://www.forgotten-adventures.net/).
Illustrations by Richard Luschek; visit his Patreon page at https://www.patreon.com/LuschekII.


# Development

Requires Node.js >= 24.

## Project structure

- `assets/packs/<name>/unique/` — source JSON files for each compendium pack
- `assets/templates/module.template.json` — module manifest template (version/URLs are injected at build time from `package.json`)
- `scripts/init.js` — ScenePacker integration
- `utils/` — build scripts

## Common tasks

```sh
npm install                  # install dependencies (first time / after pulling)
npm run deploy:qa            # build and deploy to local QA Foundry instance
npm run deploy:release       # build and create build/dist/module.zip
npm run release              # create GitHub release (needs GITHUB_TOKEN)
npm run clean                # remove build/
```

## Making content changes

Edit the JSON files in `assets/packs/<name>/unique/`. These are the source of truth — LevelDB packs are compiled from them at build time.

## Deploying locally for testing

Set environment variables for your Foundry data paths (in `.env.local` or your shell):

```
FOUNDRYVTT_DEV_DATA=/path/to/foundry/dev
FOUNDRYVTT_QA_DATA=/path/to/foundry/qa
FOUNDRYVTT_PROD_DATA=/path/to/foundry/prod
```

Then `npm run deploy:qa` (or `:dev` / `:prod`) will build and rsync to that instance.

## Releasing

1. Bump the version in `package.json`
2. Commit and push to `main`
3. `npm run deploy:release` — builds and creates `build/dist/module.zip`
4. `export GITHUB_TOKEN=$(gh auth token)` (or set in `.env.local`)
5. `npm run release` — creates a GitHub release with `module.zip` and `module.json` attached

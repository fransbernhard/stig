# STIG

Environmental data for Stockholm: air quality, bathing water, drinking water and the energy used to build the site.

Live at <https://fransbernhard.github.io/stig/>

## Data sources

- Air quality: [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api), fetched in the browser
- Bathing water: [Havs- och vattenmyndigheten](https://www.havochvatten.se/) bathing waters API
- Drinking water: yearly PDF reports from [Stockholm Vatten och Avfall](https://www.stockholmvattenochavfall.se/)
- Build energy: [eco-ci](https://github.com/green-coding-solutions/eco-ci-energy-estimation), measured in GitHub Actions
- CO₂ per page view: [CO2.js](https://github.com/thegreenwebfoundation/co2.js)

## Built with

Next.js (static export), React, SCSS modules, plain SVG charts.

## Run locally

```sh
nvm use
npm install
npm run dev
```

## Update data

Bathing and drinking water data is stored in `water.json` and `drinking-water.json`. To update:

```sh
npm run fetch-data
```

Then commit the changed files.

## Deploy

Pushing to `develop` builds and deploys to GitHub Pages.

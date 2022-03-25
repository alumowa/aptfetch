# Aptfetch

A tool to notify me of new wunderflats listings for a given set of constraints. Uses Cloudflare Workers and Workers KV for persistence.

## Environment Variables (toml)

* `START_DATE` - Lease starting date
* `END_DATE` - Lease ending date


## Other Vars (KV)

* `ENV::BOUNDING_BOX` - Region of interest (lat & long)
* `ENV::MAX_PRICE` - Maximum price
* `ENV::POI_LAT` - POI lattitude for distance calculation (nearer is better)
* `ENV::POI_LON` - POI longitude
* `ENV::SLACK_WEBHOOK` - Slack webhook url for notifications


`wrangler publish` to deploy
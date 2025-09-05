# Unified Composer App (Prototype)

This is a front-end HTML/CSS/JS scaffold for a Social Media Management + AI powered dashboard. It implements routing, modular view rendering, a global store, and placeholder AI + scheduling interactions.

## Features Implemented (Prototype Level)

- Hash-based router with dynamic view injection.
- Sidebar navigation & responsive top bar.
- Global search across scheduled posts, media, inbox (extensible).
- Dashboard metrics, upcoming posts, AI insights placeholder.
- Editorial calendar with basic day grid (drag & drop placeholder).
- Compose form with AI caption mock, evergreen & first-comment flags.
- Media Library filter (type + keyword).
- Inbox with AI reply simulation and sentiment placeholders.
- Analytics summary with export + AI insight mocks.
- Settings (profile persist, brand colors).
- Billing stub (plan + add-ons).
- Central store with localStorage persistence.
- Toast notification system.
- Theme toggle (light/dark) persisted.
- Mock realtime comment injection.

## Planned (Not Yet Implemented)

- OAuth / token-based platform connections.
- True drag & drop calendar scheduling.
- First-comment scheduler integration for IG/LinkedIn.
- AI caption styles (casual, professional, witty).
- Hashtag strategy generator with scoring.
- Competitor benchmarking dashboards.
- Influencer collaboration tracker.
- Ad campaign management & ROI modeling.
- White-label PDF report export.
- Role-based access control UI.
- Brand Kit asset uploads & font management.
- AI performance forecasting (time-series model).
- Multi-tenant billing & usage metering.

## Architecture

- assets/js/core: router, store, component registry
- assets/js/views: each route gets its own view module
- assets/js/features: cross-cutting behaviors (theme, search)
- assets/js/ui: UI micro-components (toast)
- assets/js/utils: formatting, id generation
- assets/js/mock: simulated realtime events

## State Model (Store)

```
user
platforms[]
scheduled[]  // posts in pipeline
media[]
inbox[]
analytics{}
aiCredits
plan
brandKit
```

## Extending

1. Add a New Route
   - Create `assets/js/views/newView.js`
   - Export `renderNewView(root)`
   - Register in `app.js` Router.register(...)
   - Add `<a>` in sidebar with `data-route="new-view"`

2. Integrate Real APIs
   - Replace mock seeds in `store.js` with fetch calls.
   - Add async hydration before rendering router (show loading overlay).

3. AI Features
   - Replace simulated setTimeout with fetch to your AI endpoint.
   - Add credit decrement in store.

4. Scheduling & Timezones
   - Normalize times to UTC in store.
   - Display using `Intl.DateTimeFormat` per user.timezone.

## Accessibility Notes

- Focus management: router focuses main container.
- Buttons & inputs sized for touch targets.
- Color contrast uses dynamic theming; verify with tooling for compliance.

## Build / Deployment

Currently plain ES modules. For production:
- Bundle (Vite/Rollup/ESBuild).
- Add CSP headers.
- Use service worker for caching.
- Implement environment-based config (API endpoints).

## License

MIT (placeholder).
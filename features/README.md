This directory contains feature- and domain-oriented modules.

- `calculators/`: Cutting stock calculators (1D/2D/3D) and shared logic.
- `layout/`: Application shell components such as header, footer, and theme provider.
- `marketing/`: Landing page sections and other marketing-only UI.

Each feature folder should own:
- Its domain types and hooks (unless they are truly cross-cutting).
- Its container components (stateful / orchestration).
- Its presentational components that are specific to the feature.

Cross-cutting, non-domain-specific components should live in `components/`.

# OptiCut

OptiCut is a web-based cutting stock optimizer for planning how to cut raw material into required parts with less waste. It is built for common workshop and production scenarios where material efficiency matters: bars, pipes, profiles, panels, boards, glass sheets, lumber, foam blocks, and other rectangular stock.

The app lets you enter the material you have, the pieces you need, and the cutting constraints that affect the final layout. It then generates an optimized cutting plan with efficiency, waste, material usage, cost savings when costs are provided, and warnings for pieces that cannot be placed.

## What This App Does

OptiCut supports three types of cutting calculations:

- **1D Linear Cutting**: Optimizes cuts for bars, pipes, rails, rods, profiles, and other stock defined by length.
- **2D Sheet Cutting**: Optimizes rectangular pieces on flat sheets such as plywood, MDF, acrylic, glass, metal sheets, and panels.
- **3D Volume Cutting**: Optimizes rectangular pieces inside blocks or volumes such as lumber blocks, foam, billets, and other cuboid materials.

Each calculator includes inputs for stock dimensions, required piece dimensions, quantities, optional cost per stock unit, and cutting settings such as kerf width, reusable waste thresholds, edge margins, and rotation options where applicable.

## Key Features

- Add multiple stock types and required piece types.
- Set quantities for both available material and desired output pieces.
- Account for blade kerf so cut plans reflect real material loss.
- Enable or disable rotation for 2D and 3D pieces.
- Include margins around sheets or blocks.
- View material efficiency, waste, used stock count, estimated savings, and unplaced pieces.
- Reset calculators back to useful sample data for quick experimentation.
- Use a responsive interface designed for desktop and mobile screens.

## How To Use The App

1. Open the calculator page and choose the correct mode: **1D Linear**, **2D Sheets**, or **3D Volumes**.
2. In the stock section, enter the material you have available:
   - 1D: length and quantity.
   - 2D: sheet width, height, quantity, and optional cost.
   - 3D: block width, height, depth, quantity, and optional cost.
3. In the required pieces section, enter each part you need to produce, including its label, dimensions, and quantity.
4. Adjust the cut settings:
   - **Kerf width** is the material removed by each cut.
   - **Minimum waste length, area, or volume** controls what leftover material counts as unusable.
   - **Edge margin** reserves space around 2D sheets or 3D blocks.
   - **Rotation** allows pieces to be turned when fitting them into sheets or blocks.
5. Click **Optimize Cuts**, **Optimize 2D Cuts**, or **Optimize 3D Cuts**.
6. Review the generated results, including efficiency, waste, used material, estimated savings, and any pieces that could not fit.
7. Add more stock, change piece dimensions, or adjust settings and run the optimizer again until the plan works for your job.

All dimensions are entered in millimeters. Costs are optional and are used only for estimated savings.

## Local Development

This project is a Next.js app using React, TypeScript, Tailwind CSS, Radix UI components, Lucide icons, and Three.js-related packages for 3D rendering support.

### Prerequisites

- Node.js
- npm

### Install Dependencies

```bash
npm install
```

### Start The Development Server

```bash
npm run dev
```

After the server starts, open the local URL shown in your terminal, usually:

```text
http://localhost:3000
```

### Build For Production

```bash
npm run build
```

### Start The Production Build

```bash
npm run start
```

## Project Structure

- `app/` contains the Next.js routes and page layouts.
- `features/calculators/` exposes the 1D, 2D, and 3D calculator modules.
- `components/` contains shared UI, calculator screens, and result views.
- `lib/` contains the cutting optimization algorithms and shared utilities.
- `styles/` and `app/globals.css` contain global styling.

## Notes

OptiCut is intended as a planning aid. Always verify final cut plans against your actual tools, material behavior, safety requirements, machine limits, and workshop tolerances before cutting physical stock.

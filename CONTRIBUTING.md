## Table of Contents

- [Developer Documentation](#developer-documentation)
  - [Prerequisites](#prerequisites)
  - [Overview](#overview)
    - [Scripts](#scripts)
  - [Running the Extension](#running-the-extension)

## Developer Documentation

### Prerequisites

- Install [VS Code](https://code.visualstudio.com/download)
- Install recommended extensions
- Install npm dependencies by running `npm install` in the project root directory

### Overview

- #### Scripts
  - #### `npm run dev`
    - Runs `web-ext run` and `vite build` to reload the extension and rebuild on file changes
      - \*Note that this does not include type checking in favor of faster feedback when developing. Type checking during development relies on the **Vue Language Features extension\***.
  - #### `npm run build`
    - Builds, type checks, and packages the extension

### Running the Extension

- #### Chrome
  1. Run `npm run dev`
  1. Open Chrome and go to `chrome://extensions/`
  1. Toggle **Developer mode** on
  1. Select **Load unpacked**
  1. Select the dist directory and select **Open**
  1. Open a new tab and you will see ditto in the toolbar

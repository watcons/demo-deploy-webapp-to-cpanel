# AGENTS Guide

## Project Purpose

This repository demonstrates how to provision and deploy a web application to a cPanel host using GitHub Actions, SSH, and CloudLinux Node.js application support.

The deployed system has two runtime parts:

- A front-end built with React and Vite from `front-end/`.
- A back-end API built with TypeScript and deployed as a CloudLinux Node.js app from `api/`.

The main deployment workflow is `.github/workflows/cpanel-deploy.yml`.

## Repository Layout

- `api/`: TypeScript API, Jest tests, MySQL access via Sequelize and `mysql2`.
- `front-end/`: React front-end built with Vite.
- `.github/workflows/`: deployment automation.
- `tools/`: local helper scripts for SSH setup and local workflow testing.
- `docs/`: screenshots and walkthrough material used by the README.

## Current Runtime and Tooling Baseline

- Node.js 24 is the current project baseline.
- The deploy workflow uses `actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd` (`v6.0.2`).
- The deploy workflow uses `actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e` (`v6.4.0`).
- The deploy workflow creates the CloudLinux Node.js app with `--version 24`.
- The API package uses `@types/node` on the Node 24 track.
- The dev container image tag format is `mcr.microsoft.com/devcontainers/typescript-node:24-bookworm`.

## Main Commands

- Root tooling install: `npm ci`
- API install: `cd api && npm ci`
- API build: `cd api && npm run build`
- API tests: `cd api && npm run test`
- API dev mode: `cd api && npm run dev`
- Front-end install: `cd front-end && npm ci`
- Front-end build: `cd front-end && npm run build`
- Front-end dev server: `cd front-end && npm start`

## Deployment Workflow Behavior

The workflow in `.github/workflows/cpanel-deploy.yml` currently does the following:

- Checks out the repository.
- Sets up Node.js 24.
- Installs, builds, and tests the API.
- Installs and builds the front-end.
- Configures SSH using a private key stored in GitHub secrets.
- Ensures the target MySQL database exists.
- Ensures the target subdomain exists when a subdomain is configured.
- Copies the built front-end assets to the cPanel web root.
- Destroys and recreates the CloudLinux Node.js app using Node 24.
- Copies the API package files and built output to the app root.
- Writes a production `.env` file on the host.
- Installs production modules and starts the hosted app.

Important detail: when the workflow writes the hosted `.env` file, `MYSQL_PASSWORD` is intentionally wrapped in double quotes so passwords containing shell-sensitive characters are preserved correctly.

## Local Workflow Testing

Use `bash tools/test-workflow-with-act.sh` to run the deployment workflow locally with `act` before pushing changes.

This script does not work unless local hosting credentials and SSH assets are already in place.

Required prerequisites:

- `tools/.env` must exist and contain the hosting variables expected by the script.
- `tools/keys/cpanel.key` must exist.
- `tools/keys/cpanel.key.singleline` must exist.
- `tools/keys/cpanel-test-ssh-config` must exist.
- The SSH public key must already be imported and authorized in cPanel.

How to prepare those prerequisites:

- Start from `tools/.env.template` and create `tools/.env`.
- Run `bash tools/gen-cpanel-keys.sh` to generate the SSH keypair, the single-line private key file, and the SSH config file.
- Import `tools/keys/cpanel.key.pub` into cPanel and authorize it for SSH access.
- Run `bash tools/test-cpanel-ssh.sh` to confirm SSH access works before attempting the `act` workflow run.

What `tools/test-workflow-with-act.sh` does:

- Loads variables from `tools/.env`.
- Verifies `tools/keys/cpanel.key` exists.
- Generates temporary `tools/keys/act-vars` and `tools/keys/act-secrets` files.
- Runs `act` against `.github/workflows/cpanel-deploy.yml`.

## Recently Verified Facts

- The end-to-end `bash tools/test-workflow-with-act.sh` run completed successfully after the Node 24 upgrade.
- The upgraded action SHAs above work correctly with `act` and with the current workflow structure.
- The workflow successfully created and started the CloudLinux Node.js app on version 24 during validation.
- A host preflight check showed Node 24 was available in CloudLinux on the validated hosting account.
- The current deploy path depends on SSH access being fully configured before any local `act` run can succeed.

## Editing Guidance

- Prefer minimal workflow edits. This repository is intended as a working deployment demonstration, so operational breakage matters more than stylistic cleanup.
- When changing deployment behavior, validate with `bash tools/test-workflow-with-act.sh` if the required credentials and keys are available.
- When changing SSH setup behavior, review `tools/gen-cpanel-keys.sh`, `tools/test-cpanel-ssh.sh`, and `tools/test-workflow-with-act.sh` together because they form one setup chain.
- When changing Node versions, keep the workflow runtime, CloudLinux app version, API typings, and dev container image aligned.

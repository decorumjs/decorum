# @decorum
Monorepo containing all `@decorum` package libraries.

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Wallaby.js](https://img.shields.io/badge/wallaby.js-configured-green.svg)](https://wallabyjs.com)

## Package Listing
All `@decorum` packages are listed below, in alphabetical order along with a short description.

| Package Name                                                   | Description                                 |
|:---------------------------------------------------------------|:--------------------------------------------|
| [@decorum/dynamodb-seeder](packages/dynamodb-seeder/README.md) | Command-line interface for seeding DynamoDB |

## What is Decorum? 
Decorum is a collection of TypeScript packages aimed at making serverless application development easier.
It encompasses many aspects including REST API handlers and data access layer.

## Design Philosophy
Decorum takes the [single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) approach, where each package should do **one** thing and do that **one** thing well.

When designing packages there are several key characteristics we focus on:

- **Ergonomic** - Is this package intuitive and easy to use for developers to integrate?
- **Consistent** - Does this package conform to the conventions of the language and frameworks?
- **Reliable** - Does the code work as expected and has adequate test coverage?

The goal is that once you use a certain package, you would wonder how you survived without it.

## Is Decorum just another framework?
**No.** Instead of trying to be *Yet Another Framework*, we consider Decorum to be extensions upon the already popular frameworks.

## Why are the packages split up?
We intentionally publish and version each package independently to avoid being another monolithic framework.

This allows developers to pick and choose more freely, as well as avoiding the code bloat of importing a large library.
This is especially true when aiming to reduce total package size for deploying serverless applications.

Since each package is versioned independently, you have more control over package versions compared to a single large library.
This helps avoid inadvertent breaking changes across unrelated functions, and allows more graceful upgrade paths in the future for major versions.

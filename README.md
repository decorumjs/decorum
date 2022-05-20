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
**No.**
Instead of trying to be *Yet Another Framework*, we consider Decorum to be extensions or helper functions upon the already popular frameworks.

## Why are the packages split up?
We intentionally publish and version each package independently to avoid being another monolithic framework.

This allows developers to pick and choose more freely, as well as avoiding the code bloat of importing a large library.
This is especially true when aiming to reduce total package size for deploying serverless applications.

Since each package is versioned independently, you have more control over package versions compared to a single large library.
This helps avoid inadvertent breaking changes across unrelated functions, and allows more graceful upgrade paths in the future for major versions.

## How did Decorum come about?
When first getting into serverless development, we noticed a lot of [anti-patterns](https://en.wikipedia.org/wiki/Anti-pattern) emerging.
Many of these seemed to come from API developers who were familiar with frameworks like Express or Koa, trying to go serverless.

Seeing these router-based frameworks being shoehorned into Lambdas via a single proxy endpoint felt wrong, and came with its own overhead and issues.

But we understood why it was being done. Years upon years of API development with tried and true middlewares were hard to give up.
What was the alternative, to write all that yourself? Why bother when it already worked anyhow? This is how anti-patterns are born and perpetuated.

Decorum was started from pondering the question: "what *should* serverless development be like in modern TypeScript?"
This may seem like an opinionated question, but the key is to consider the ideal versus the status quo in API development.
We saw it very similar to how developers misuse NoSQL databases, by building them the same way as traditional relational databases.

Most packages come from a specific pain point or repetitive task in developing serverless applications.
Following the [DRY principle](https://en.wikipedia.org/wiki/Don't_repeat_yourself), it makes sense to encapsulate each one of these into a package that can handle it easily, elegantly, and reliably.

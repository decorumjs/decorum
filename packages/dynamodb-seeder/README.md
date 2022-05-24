# `@decorum/dynamodb-seeder`

Command-line interface for seeding data into DynamoDB

[![npm version](https://badge.fury.io/js/@decorum%2Fdynamodb-seeder.svg)](https://badge.fury.io/js/@decorum%2Fdynamodb-seeder)

## Why do I need this?
When working with serverless projects, you often need to seed initial tables, indexes, and items into DynamoDB.

Most projects will have accompanying data files that are used to populate the local database via a simple package script.
You can also use this to seed remote environments, if you so wish.

## What makes this seeder special?
While there are many DynamoDB seeder libraries and utilities available, there are several advantages to ours:

- **YAML Support** - Allows for much more compact and readable data files
- **Glob Support** - Allows for pattern matching on files
- **Index Support** - Can create secondary indexes on tables
- **Lint Support** - Data files are linted before seeding and can be linted on demand (CI/CD)
- **Smart** - Seeded in order of `Tables -> Indexes -> Items` across all files
- **Lightweight** -  Uses the new modular [AWS SDK v3](https://github.com/aws/aws-sdk-js-v3)
- **Tested** - Complete unit test coverage

When trying various existing DynamoDB seeders, we felt that each had quirks or limitations that were frustrating.
So we ended up making this one to suit our needs.

## Single-Table Design
We use the [Single-Table Design](https://www.alexdebrie.com/posts/dynamodb-single-table/) approach to DynamoDB as much as possible.
The seeder was built around the common cases and design patterns when using a single table with global secondary indexes (GSIs).

However, even if you are not employing that design pattern you can still use this seeder all the same.
We do recommend you checking out Single-Table design though!

**If you're curious...**

- [AWS re:Invent 2018: Amazon DynamoDB Deep Dive](https://www.youtube.com/watch?v=HaEPXoXVf2k) (Rick Houlihan)
- [Fundamentals of Amazon DynamoDB Single Table Design](https://www.youtube.com/watch?v=KYy8X8t4MB8) (Rick Houlihan)
- [The DynamoDB Book](https://dynamodbbook.com/) (Alex DeBrie)

## Installation
You can install the command-line interface globally:

```bash
$ npm install -g @decorum/dynamodb-seeder
```

Or as a dev-dependency for your project:
```bash
$ npm install -D @decorum/dynamodb-seeder
```

## Usage
Once installed you can use the `dynamodb-seeder` command-line interface:

```bash
dynamodb-seeder <cmd> [args]

Commands:
  dynamodb-seeder lint [options] <files..>    Lints data files for errors
  dynamodb-seeder seed [options] <files..>    Seeds data files into DynamoDB

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

If you want help for specific commands, you can run `dynamodb-seeder <cmd>> help`.

See the [examples](./examples) for sample YAML files.

### Lint
You could lint some files individually:
```bash
$ dynamodb-seeder lint tables.yml indexes.yml items.yml
```

Or you can use [glob](https://www.npmjs.com/package/glob) pattern matching:

```bash
$ dynamodb-seeder lint './examples/**/*.yml'

examples/indexes.yml - OK
examples/items.yml - OK
examples/tables.yml - ERROR: Sort key type is invalid
```
This can be useful if you store all your seed data files in a single directory within your project.

**NOTE:** The `lint` command will return a non-zero exit code if **any** data file fails validation.

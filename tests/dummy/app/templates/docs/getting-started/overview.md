# Overview

There are many aspects of Ember that has been difficult to tests or challenging to write meaningful tests. This addon aims to solve some of these issues by providing helper primitives to solve these issues.

This addon is organized into 3 main modules:

- `serializer` - contains test helpers for `ember-data` serializers. Use these helpers to invoke serializer hooks.
- `adapter` - contains test helpers for `ember-data` adapters. Use these helpers to invoke adapter hooks.
- `capture` - contains test helpers for capturing side-effects such as network connection and route transitions.

Read the API doc for details usage guide.

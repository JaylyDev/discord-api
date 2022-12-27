// Copyright (c) Microsoft Corporation.  All rights reserved.

import * as GameTest from "@minecraft/server-gametest";

GameTest.register("DebugTests", "always_succeed", (test) => {
  test.runAfterDelay(40, () => {
    test.succeed();
  });
}).maxTicks(50)
  .tag(GameTest.Tags.suiteDebug)
  .structureName('discord_gametest');

GameTest.register("DebugTests", "suite_default", (test) => {
  test.runAfterDelay(40, () => {
    test.succeed();
  });
}).maxTicks(50)
  .tag(GameTest.Tags.suiteDefault)
  .structureName('discord_gametest');

GameTest.register("DebugTests", "suite_disabled", (test) => {
  test.runAfterDelay(40, () => {
    test.succeed();
  });
}).maxTicks(50)
  .tag(GameTest.Tags.suiteDisabled)
  .structureName('discord_gametest');

GameTest.register("DebugTests", "suite_all", (test) => {
  test.runAfterDelay(40, () => {
    test.succeed();
  });
}).maxTicks(50)
  .tag(GameTest.Tags.suiteAll)
  .structureName('discord_gametest');

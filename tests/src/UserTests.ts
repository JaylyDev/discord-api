
  test.assert(memberTag === 'Jayly#1397', 'Member tag assert failed.');
  test.assert(member.getJoinDate().getTime() === 1524738361417, 'Member join timestamp assert failed.');
}).maxTicks(100)
  .tag(GameTest.Tags.suiteDefault)
  .structureName('discord_gametest');
PokeFinderServer
==============

## Routes

### Raids
+ GET /raids -> Returns Raid list
+ POST /raids -> Create a raid
+ GET /raids/:raid_id -> Returns raid with the given id
+ PUT /raids/:raid_id -> Modify raid
+ PUT /raids/:raid_id/message -> Adds a new message to the raid chat
+ GET /raids/:raid_id/messages -> Returns raid messages
+ DELETE /users/:raid_id -> Delete raid

### Boss
+ POST /boss -> Create a boss
+ GET /boss -> return Boss list
+ GET /boss/:boss_id -> return boss with the given id (Missing)

PokeFinderServer
==============

## Routes

### Raids
+ GET /raids -> Returns Raid list
+ POST /raids -> Create a raid
+ GET /raids/:raid_id -> Returns raid with the given id
+ PUT /users/:raid_id -> Modify raid
+ POST /raids/:raid_id/message -> Adds a new message to the raid chat
+ GET /raids/:raid_id/messages -> Returns raid messages
+ DELETE /users/:raid_id -> Delete raid

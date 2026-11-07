## 0.85.0 — Chests in the Doom Gauntlet, fairer ink and translated messages

### New

- Doom Gauntlet: Each boss is drawn a chest of paint or clothing for the 5 greatest damages, one of each quality (1st legendary, 2nd epic, 3rd rare, 4th unusual, 5th common), by mail. The others continue with the ticket, gold and XP. Everybody online sees who won what.
- Ink chest: the same five qualities of the clothing chest, with a catalog ink.

### Improvements

- Log and Combat tab messages translated into your language.
- The "ready" of the craft NPCs updates alone when collecting.
- Buy at NPC: The stack is heavy as stack, and the warning says how many you can still buy.
- Mural of the founders in a list only, in order of purchase; team accounts appear with [STAF].

### Fixes

- The paint does not paint mounts or unique pieces, and only paints pieces in the original color (use the remover first).
- Dead and ninja clothes are out of the game for now.

## 0.84.0 — Hunt, wizard and minimized window

### New

- The new hunt begins in Trivial. The last difficulty you used is selected.

### Improvements

- To provoke calls the living monsters from the point and the warrior holds the target while still reaching.
- Archer and wizard walk through the Dungeon to a place where they see the target.
- Each magic spends a reagent.
- Several magician's magics spend less mana. Chain lightning and meteor swarm hit harder, and the swarm recharges in eight seconds.
- Conjuring, recovery and less mana of the wizard cost 2 points, such as the attributes of the other classes.
- The training mannequins have left town.

### Fixes

- With the game minimized, hunting doesn't move another step every two seconds.
- Island 2: the ground where you walk accompanies the new map.

## 0.83.0 — VIP seal, group and cure

### New

- VIP stamp: While the account is VIP, a gold crowned seal may appear next to your name (choose in the wardrobe). When the VIP is over, he leaves.

### Improvements

- The offline hunt (continue hunting if the connection falls or the game closes) is now a VIP advantage.

### Fixes

- Leaving the group on the panel no longer ends the hunt of others: only those who left return. When the leader leaves, the group falls apart and everyone comes back.
- With life full, the character no longer stands in "Recovering Life..." during the hunt.
- The healing lines about the character appear in the player's language.
- The Beta event chest appears with the right icon.

## 0.82.0 — Beta Event, Weight Shopping and Ready Group

### New

- Beta Event: Those arriving at level 20 receive a chest with the Beta Robe in an exclusive color of choice, and the Beta icon. One on. Thank you for testing our game!
- Ranking with the top 100 positions (it was 50).

### Improvements

- Group: Whoever was ready remains ready after the hunt — the leader starts again and takes the group.
- Business NPCs only warn when the stock is full.
- The reagent bag ceases to exist: the reagents come loose in the backpack, and the old bags are emptied without losing anything.
- The founding knights of Cove show the seal of founder.

### Fixes

- Buying at NPC more than the character can handle is refused with a warning instead of making it too heavy.
- Archer and wizard in the distance 4 retreat to 3 houses (before they were stopped as in the distance 1).
- In dungeon and boss the weight no longer counts: the character does not walk from house to house because it is heavy.
- Items from the store and the mail that go to the backpack are not delivered if they pass the weight that the character can handle.

## 0.81.0 — Protected wardrobe, ammunition and builds

### New

- Builds A, B and C: the combat equipment saved by character, exchanged at once.
- Wall of the Founders and three founding knights in Cove.
- The craft NPCs say when there is ready collection.
- Group: Begin the hunt immediately, with whom you have already confirmed.

### Improvements

- The energy spent on the hunt appears instantly at the top bar.
- Recording warnings from the world appear in the player's language.

### Fixes

- The wardrobe clothes are no longer lost: dressed, they stay with you when the character dies. Whoever lost a piece for that mistake gets the piece back in the mail.
- Bow and beast: the ammo is over, it's over. She's not coming back alone anymore.
- The bot only heals with bandages if the bandage is in the shortcut bar.
- Public groups show the monster of the leader's current hunt.

## 0.80.0 — Ranking, city and hunting

### New

- Ranking: 3 class hunting skills (including Arms Lore); craft crafts are not yet on the panel list.
- Ancient Rangers receive Arms Lore Cap/Piso when opening the ranking or login.
- In the city there is no item left on the floor; `[destroy <serial>` erases item from the backpack/bank (requested by the client's menu).
- World boss score sends the character class.
- Khaldun: P3 and P5 points removed from the layout.

### Improvements

- Provoking: `ally aggro` has allies with aggro (does not treat 2 as “connected”).
- Target “less life” in hunting gets skepticy; taunt radius shorter.
- Hunting difficulty is only the mix multiplier (without stacking level/XP/gold apart).

### Fixes

- EnsureClassSkillFloors in active tree skills (Warrior/Ranger/Mage).

## 0.79.0 — Messages in your language and nothing lost in deploys

### New

- The messages of the game arrive in your language: Portuguese, English, Spanish, German, French, Italian, Polish, Russian, Turkish, Japanese and Chinese.
- Voting EXP Scroll: +50% EXP in hunting for the entire account for 2 hours of hunting, and accumulates.
- Clothes chest as an item in the backpack, opened with raffle.
- Warnings in the corner when you finish a reagent, arrows or bandages, and when the hunt ends for lack of something.
- Confirmation of each purchase, sale, repair or melting in NPCs.
- Global line every Paragon defeated.
- XP to everyone who helped defeat the boss.
- Team warnings from the panel, the whole game.

### Improvements

- The world is saved before every server update: nothing gets lost in the deploy.
- Players pass each other without pushing; creatures keep blocking.
- Hunting and boss gate: it enters up to four houses of it.
- Prey: The list of a free slot changes alone every 8 hours.
- Recommended level of each creature.

### Fixes

- The server fell when someone in the group died on the hunt.

## 0.78.1 — Idle warning, party and chat combat

### New

- **`[idlebcast <hours `[idlebcast clear]` removes.
- Group: stamina in slots; public checkbox and LFG auto for the leader.

### Fixes

- Healing/banding/potions stop polluting the Local chat (only combat).
- Ranger and Warrior: Meditation no longer rises in hunting; Cap/Base zeroed.
- Mob chart in the lobby uses the chosen difficulty (life/damage = spamn).
- Teleport to the leader remains after failure (arrows/reags) and reoffers the button.
- Passing blocked leadership during hunting; party list syncs the new leader.
- Broadcast duration rejects NaN/Infinity.

## 0.78.0 — Bosses, EXP, Kick and Group events

### New

- **Exp Events**: The team can connect an EXP bonus to the entire game; the game warns in Global chat when it starts and ends.
- * *Boss worldwide**: Congratulations screen with awards and damage for those who helped; Global says the gold each won.
- ** Kick reward**: Rescue points from the official channel turns 1,000 gold by mail.
- ** Public group** announced in Global; the group window tells where each member is.
- ** Global chat history** stored on the server.
- ** Monster's Dream**: half right is worth half the points.
- Warning to everyone when a Paragon is defeated or a boss appears.

### Improvements

- Conquests: Gold rewards ×10.
- The wizard and the archer's initial hats.
- Prey: Release the slot draws new monsters and keeps the time missing; time does not return until 2 o'clock when it is over.

### Fixes

- Energy spends the exact hunting time, adding up short hunting.
- Monster Shadow's announcement came out of Global chat.

## 0.77.0 — Founders by Lastlink and Seal Choice

### New

- * *Choose your founder seal**: Who bought more than one package chooses in the Wardrobe which stamp appears next to the name, or none.
- **Buy confirmation**: When the payment of UOCoin or a founder package falls, the game warns on screen.

### Improvements

- The founder packages were sold again by Lastlink, by card or PIX; the purchase by UOCoin came out.

## 0.76.2 — Score: damage received

### New

- The game's score begins to count ** damage received** from the creatures of the session (total, DPS and list by monster), and the damage caused by skill.

## 0.76.1 — Beta: hunting slots + tree (equip/vital)

### Fixes

- Climb Str/Dex/Int no longer disarm weapon/armor ('ValidateEquipment' aligned to Idle).
- Stamina purchased applies in 'StamMax' and up the bar; UI shows **+5** (not +1).

### Improvements

- Pool instances: **~222** slots (32–254, internal jump 127); before 95.
- All classes: **Hits, Mana and Stam** on the tree; vitals and combat begin at cost **2** AP; JSON sends 'step'.

## 0.76.0 — Founder Packages by UOCoin

### New

- ** Founding packages by UOCoin**: Bronze 500, Silver 1,000 and Gold 2,000 UOCoin, purchased at the Store. The package comes in the mail from whoever bought it.
- The packages now bring a robe in the color of the metal in place of the mantle, minigame tickets (10, 40 or 90) and reset scrolls of the tree (1, 2 or 3) instead of the transfer stone.

### Improvements

- New prices of mounts in the Shop: war horse 300, llama 400 and ostard 500 UOCoin.
- The transfer stone has left the Store; the ones you already have are still working.

## 0.75.1 — Real IP via bridge WS

### Fixes

- Idle players (browser/cellular) stop showing up with Bridge Docker IP. The bridge sends 'IDLEIP' and the hard saves the real IP into the / `.admin' account (and revalidates ban/filter).

## 0.75.0 — Chests in the framework of conquests

### New

- * Marks of points of conquest** now give trunks of clothes instead of fixed clothes: common to 50 points, unusual to 150, rare to 300 and 500, epic to 800 and 1,200 and legendary to 2,000. The chest arrives in the mail and opens when you rescue the letter.

## 0.74.0 — Clothes chests on invitations

### New

- ** Clothes chests**: five trunks — common, unusual, rare, epic and legendary — each in its own color. Opening gives a classic outfit a drawn color, and the better the chest, the greater the chance of a rare or ultra rare color. Clothes go straight to the wardrobe.
- The invitation marks now give trunks: common in the first friend, unusual in the third, rare in the fifth, epic in the 10th and legendary in the 25th and 50th. The chest arrives in the mail and opens when you rescue the letter.
- ** Count before the Shadow of the Monster**: with two players in the room, the match starts 30 seconds later, to give more people time to enter; if someone leaves and there is one left, the count stops.

### Improvements

- The horse bought with gold went on to cost 100,000 gold.

## 0.73.0 — Horse for gold, letter of vote and conquests

### New

- The horse now costs 10,000 gold (in the stable and the coachman) and left the UOCoin Store.
- Each vote on TopIdle also arrives with a letter of thanks in the mail, confirming UOCoin credited.

### Fixes

- There were two achievements of "entering a guild"; there was only one (who had already continued with it).

## 0.72.0 — Invitation marks, warrior's weapons and wardrobe without copies

### New

- Invitation marks: with 1, 3, 5, 10, 25 and 50 friends who created character by your link, you receive in the mail an exclusive color outfit.
- The warrior also begins with a kryss and an apple in the backpack, besides the long sword, to choose the fighting style.

### Fixes

- The wardrobe no longer stores copies of the same piece in the same color as its characters: the copy is discarded (create and delete characters filled the wardrobe with repeated pieces).

## 0.71.0 — Founder Packages and TopIdle Vote

### New

- Founder packages: when you buy, you receive by mail the letters of the team with the war horse in the metallic color of the package, the bonus UOCoin and the services, and wins the founder seal next to the name.
- Founding colors are unique: they cannot be dyed on top, taken with the remover or sold at auction.
- Vote UO Idle on TopIdle gives 2 UOCoin, delivered to your balance with a message of thanks.

## 0.70.5 — Quit if leader / kill die + rejoin

### New

- Flag `SairSeLederDie': when the leader dies, the rest leaves the hunt.
- After dying → Cove: if party still hunts, send `PARTYTP` to late-join.

### Improvements

- 'Get outIfAllied Die' (off) only goes for death of non-leader mate — the group can continue and the dead come back.
- Host de late-join has to be alive; `[partygolider` tries late-join before “you are already the leader”.

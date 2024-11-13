# Cadet Rewrites — Sol Keeper Phase 3 (A3, A4)
Target: Flesch–Kincaid grade 5 or lower. Sentences are about 10 words or fewer, in active voice, with one idea each.
How to use: these are NEW Cadet-depth strings. Specialist and Commander text stays as it is, except where Section 5 says a Specialist string is wrong.
Keys and {placeholders} are unchanged. Nothing here has been run through the readability script; Claude Code must score every string and report any still above grade 5.

Status of every row: DRAFT, awaiting science-teammate sign-off (accuracy) and two kids reading aloud (clarity).

## Conventions
- "day" replaces "sol" in all Cadet copy. DECISION NEEDED: the Cadet UI (clock, "Run the sol" button, Sol Planning) must say "day" too. If it can't, switch these strings to "sol" and wrap it in <Term>.
- Cadet vocabulary follows the existing Cadet log text: "air cleaner" (CO2 scrubber), "water recycler" (water reclamation), "air machine" (MOXIE), "solar panels" (arrays), "power plan" (priority list).
- "power plan" works for both the full priority list and the three Junior choice cards, so these guides survive M13.
- Terms to wrap in <Term>: carbon dioxide, radiation, solar particle storm, shielding, reactor, battery, rations, air cleaner, water recycler, air machine, storm shelter, Decision Card, Caution.
- Hours become days: Mars 24.66 h = 1 sol, Moon 24 h = 1 day. Hour 200 = day 8, 300 = 12, 420 = 17, 500 = 20 (Jezero). Hour 100 = day 4, 500 = day 21 (First Light). Hour 150 = 6, 900 = 38, 1400 = 58, 1800 = 75 (Long Night).

---

## Section 1 — Mission guides (51)
File: apps/web/src/dial/missionGuides.ts. Add as separate Cadet keys.

### Jezero Outpost
| Key | New Cadet text |
|---|---|
| jezero-outpost.tagline | Mars · 30 days · solar power and a big dust storm |
| jezero-outpost.paragraph.0 | Jezero runs on solar panels and one big battery. There is no reactor to help. Around day 8, a dust storm hides the sun for over 2 days. When power runs short, the base turns things off, least important first. You decide what is important. Plan before the storm, not during it. |
| jezero-outpost.paragraph.1 | Quiet days matter too. Every day you can change five things: food and water rations, the air cleaner, the water recycler, the heater, and extra work hours. Each one helps something and costs something else. The list below explains each one. |
| jezero-outpost.step.0 | Before launch, pick your crew size, your power, and your shielding. Jezero has no reactor, so a bigger battery helps a lot. You make all your own power for nights and storms. |
| jezero-outpost.step.1 | Each day, before you press Run, check the five gauges: oxygen, CO2, water, food, and battery. If a gauge says Caution, fix it now. Change your rations, air cleaner, or power plan. Don't just hope it will be fine. |
| jezero-outpost.step.2 | Make your power plan early. Put life support and the air cleaner at the top. Put the greenhouse and the air machine near the bottom. You can live without them for a while. Then, when power runs short, you lose only what you can spare. |
| jezero-outpost.step.3 | Around day 6, get your battery as full as you can. Then try not to use it up. A dust storm starts around day 8. You can't fill the battery once the storm hides the sun. |
| jezero-outpost.step.4 | When the storm hits, around days 8 to 10, your solar power stays low. You can't change that. Your plan protects you now. If your list is in the wrong order, you could lose an important system. |
| jezero-outpost.step.5 | Around day 12, a pump can break. You have only one spare part. A Decision Card shows two ways to fix it. One is cheap but leaves the pump weaker for good. The other takes more crew time but fixes it fully. You can't afford both, so think before you pick. |
| jezero-outpost.step.6 | Around day 17, a solar particle storm comes. It lasts 18 hours. When it starts, send everyone to the storm shelter. Use Incident Command. If you stay in the open, you get extra radiation you could have avoided. |
| jezero-outpost.step.7 | Around day 20, a plant disease can hit. You may want the bonus goal: pick both plant trays. A late hit is hard to fix. Keep your plants healthy before then, so you have some to spare. |
| jezero-outpost.step.8 | In the last few days, check your goals. Do you have enough science? Is everyone's radiation safe? Is everyone alive? Nothing warns you if you are falling behind before the 30 days end. |

### First Light
| Key | New Cadet text |
|---|---|
| first-light.tagline | Moon · 2 crew · one long night, about 15 days |
| first-light.paragraph.0 | First Light is all about your battery. Days on the Moon are bright, with no dust. But the night lasts about 15 days. For all that time, there is no sunlight. Your huge battery must run the base all night. Any power you waste early is power you won't have later. |
| first-light.paragraph.1 | With only 2 crew, every job matters. There is no one extra to help. This mission has no air machine and no dust storms. The Moon has no air to make oxygen from, and no wind to carry dust. |
| first-light.step.0 | Before launch: with 2 crew, three of the five jobs will have nobody. Setup can't fix that. In an emergency, someone can still help, but not as well. Keep that in mind when you pick how hard the mission is. |
| first-light.step.1 | Save power from the very first day, not just when night is near. Anything the comms, the greenhouse, or the water recycler uses by day is power the battery won't have at night. The base only turns things off when it truly runs short. Nothing saves power for you. |
| first-light.step.2 | Make your power plan before the sun goes down. Put the oxygen maker, the water recycler, and life support high on the list. Put comms and the greenhouse lower. This mission has very little power to spare. |
| first-light.step.3 | Around day 4, an 18-hour solar particle storm comes. It is still daytime, so you have plenty of power. Send the crew to the storm shelter as soon as it starts. This is the easiest problem in this mission. |
| first-light.step.4 | When night comes, be careful with the heater's power-save setting. On this mission it is risky. The heaters have very little extra power on the coldest part of the night. Try turning off other things first. |
| first-light.step.5 | During the long night, check the battery gauge every day. It tells you if your saving worked. If the battery is heading for empty in the middle of the night, no sunlight is coming to help for a long time. |
| first-light.step.6 | Around day 21, deep in the night, a pump can break. You have only one spare part. It is the same hard choice as on Jezero: a quick fix that leaves lasting damage, or a costly fix that does not. And now your battery is low. Decide ahead of time what you will do. |
| first-light.step.7 | Your goal: keep everyone safe through the whole night. Your bonus goal: finish with nothing broken. |

### The Long Night
| Key | New Cadet text |
|---|---|
| the-long-night.tagline | Moon · 4 crew · three long nights, with a reactor |
| the-long-night.paragraph.0 | The Long Night gives you a reactor. It is a small nuclear power plant. It makes power all day and all night. There are no solar panels. The reactor makes more power than the base needs, even to keep it warm in the freezing night. Day and night are no longer the problem. The mission lasts three Moon days and nights. That is about 88 days. |
| the-long-night.paragraph.1 | Now the danger is slow. Space radiation adds up across all three nights. A choice you make in the first storm still counts in the third. You win by being patient and steady. One big moment will not decide it. |
| the-long-night.step.0 | Before launch: you have 4 crew and a reactor, so power is easier here. Spend your setup choices on radiation shielding and on your crops. You do not need to worry about battery size. |
| the-long-night.step.1 | The reactor covers what the base needs, so power-saving settings matter less here. These are the heater's power-save mode and the air cleaner's easy mode. Do not use them just because they are there. You gain little, and they cost something. |
| the-long-night.step.2 | Treat every day the same way. This mission is about staying steady for 88 days, not one great choice. Pick a steady ration setting and job plan early. Keep them. Do not change them every day. |
| the-long-night.step.3 | Around day 6, an 18-hour solar particle storm hits. Send your crew to the shelter. This is only the first of two storms. Radiation your crew gets now stays on their record for the whole mission. |
| the-long-night.step.4 | Around day 38, a pump can break. This time the system has three spare parts, not one. You have room to pick the fix that leaves no lasting damage. The other missions can't always afford that. |
| the-long-night.step.5 | Around day 58, a plant disease can hit the lettuce or the wheat. Wheat takes 64 to 86 days to grow. That fits inside this mission. But fixing a late disease still takes time. You have less time than it seems. |
| the-long-night.step.6 | Around day 75, a second, bigger storm hits. It lasts 24 hours. Your crew's radiation total already includes the first storm. Check each person's radiation gauge against the limit before you decide. How long can they stay outside the shelter? |
| the-long-night.step.7 | Over all three nights, keep checking each person's total radiation. It is the slow danger that is easy to miss on a long mission. |
| the-long-night.step.8 | The goal is the same as First Light: keep everyone safe for the whole mission. The bonus goal: finish with nothing broken. |

### Crisis: Apollo 13
| Key | New Cadet text |
|---|---|
| crisis-apollo13-co2.tagline | Heading home from the Moon · 3 crew · April 1970 |
| crisis-apollo13-co2.paragraph.0 | On the way to the Moon, an oxygen tank burst. The 3 astronauts moved into the Moon lander, called Aquarius. It was built for 2 people for about 2 days. Now it had to keep 3 people safe for almost 4 days. |
| crisis-apollo13-co2.paragraph.1 | The filters from the main spaceship were square. The holes in the lander were round. They did not fit! Carbon dioxide, a gas we breathe out, kept building up. Mission Control had an idea. The crew made a fix from hoses, a cover, plastic bags, and tape. |
| crisis-apollo13-co2.step.0 | Open the Life Support Console. Watch the carbon dioxide go up. It starts a little high and keeps rising. |
| crisis-apollo13-co2.step.1 | Build the filter fix before the carbon dioxide gets dangerous. |
| crisis-apollo13-co2.step.2 | Keep the air safe to breathe all the way home. |

### Crisis: 1972 radiation storm
| Key | New Cadet text |
|---|---|
| crisis-spe-1972.tagline | The Moon · a real storm from August 1972 |
| crisis-spe-1972.paragraph.0 | In August 1972, the Sun sent out one of the biggest radiation storms of the space age. It came between two Moon missions, Apollo 16 and Apollo 17. So no astronaut was in the storm. |
| crisis-spe-1972.paragraph.1 | Scientists say astronauts outside on the Moon could have been in great danger. In this mission, imagine your crew is outside when it hits. Get them to a room with thick walls, fast. |
| crisis-spe-1972.step.0 | Spot the radiation storm as it starts. |
| crisis-spe-1972.step.1 | Move the crew to the storm shelter right away. |

### Crisis: Mir fire
| Key | New Cadet text |
|---|---|
| crisis-mir-fire.tagline | Mir space station · February 1997 · a fire in an oxygen maker |
| crisis-mir-fire.paragraph.0 | On the old space station Mir, a machine that makes oxygen caught fire. Thick smoke, bad to breathe, filled the room. |
| crisis-mir-fire.paragraph.1 | The crew put on masks and fought the fire with fire extinguishers. Power and radio were hard to use too. |
| crisis-mir-fire.step.0 | Put on masks. Use the fire extinguishers. |
| crisis-mir-fire.step.1 | Shut off the air flow so the smoke does not spread. |

---

## Section 2 — Crisis briefings (6)
File: apps/web/src/views/Crisis/CrisisSelectionView.tsx (move strings to i18n Cadet keys).

| Key | New Cadet text |
|---|---|
| crisis.apollo13.onsetLead | It is April 1970. On the way to the Moon, an oxygen tank burst. The 3 astronauts moved into the Moon lander, Aquarius, to stay safe. It was built for 2 people for about 2 days. Now it must keep 3 people safe for almost 4 days. |
| crisis.apollo13.onsetDetail | Carbon dioxide, a gas people breathe out, is building up in the air. Filters take it out. But Aquarius's round filters are used up. The spare filters in the other spaceship are square. They do not fit. The gas keeps rising slowly. Can you find a fix in time? |
| crisis.spe1972.onsetLead | In August 1972, the Sun sent out one of the biggest radiation storms ever seen in the space age. It came between two Moon missions, so no one was in the storm. Scientists say astronauts outside on the Moon would have been in great danger. |
| crisis.spe1972.onsetDetail | In this mission, you imagine it happens now. Your crew is outside, exploring. Space radiation can hurt people who are not protected. Get everyone into the shelter with thick walls, fast. |
| crisis.mirFire.onsetLead | It is February 1997, on the old space station Mir. A machine that makes oxygen caught fire in one room. Flames and smoke spread. The fire blocked the way to one of the escape ships. |
| crisis.mirFire.onsetDetail | Smoke that is bad to breathe is filling the station. The crew put on masks and use fire extinguishers on the flames. Can you put out the fire and keep everyone safe? |

---

## Section 3 — Debrief and ScoreCard (9)
| Key | New Cadet text | Implementation note |
|---|---|---|
| scorecard.bestDecision | On day {sol} you picked "{chosenLabel}". It worked better than "{alternativeLabel}". | NEW placeholders. Resolve chosenOption and alternativeOption (already on HighlightedDecision) to the CADET response labels in decisionText.json. If a label is missing, fall back to: On day {sol} you made a great call. |
| scorecard.costliestDecision.zero | You made no big mistakes. Everything stayed in the safe zone. | |
| scorecard.costliestDecision.nonzero | On day {sol} you picked "{chosenLabel}". "{alternativeLabel}" would have cost the crew less. | Same label resolution. If the costliest event is not an incident choice (for example a planning decision), fall back to: On day {sol} something cost the crew a lot of safety. Open the Black Box to see what happened. |
| debrief.notReadyHint | The Black Box tells the story of your mission. It shows up when the mission ends. Keep your outpost going! | |
| debrief.outcomeSuccess | You did it! {{living}} of {{crew}} crew are home safe after {{duration}}. | |
| debrief.outcomePartial | Everyone is safe, but the crew did not finish the goal. The mission ended at hour {{hour}} ({{timestamp}}). | |
| debrief.outcomeAbort | You chose to bring the crew home early. Real mission teams make this choice too. The mission ended at hour {{hour}} ({{timestamp}}). | |
| debrief.outcomeLoss | The mission had to end at hour {{hour}} ({{timestamp}}). Let's see what happened and what you could try next. | Crew-loss wording still comes from presentation/crewLoss.ts. |
| debrief.crewLossWindowHint | These things were happening in the 3 days before. They may not be the only reason. Sometimes many small problems add up. | |

---

## Section 4A — Goal text (12)
File: apps/web/src/i18n/en/goalText.json

| Key | New Cadet text |
|---|---|
| scenario.jezero.goal.primary | Do enough science. Keep everyone's radiation under the safe limit. Bring everyone home safe. |
| scenario.jezero.goal.stretch | Pick every plant tray before you're done. (unchanged) |
| scenario.firstLight.goal.primary | Keep everyone safe for the whole mission. |
| scenario.firstLight.goal.stretch | End the mission with nothing broken. |
| scenario.theLongNight.goal.primary | Keep everyone safe through all three long nights. |
| scenario.theLongNight.goal.stretch | End the mission with nothing broken. |
| crisis.apollo13.goal.primary | Keep all 3 astronauts safe until the air filter fix is ready. |
| crisis.apollo13.goal.stretch | Fix the air without breaking anything else. |
| crisis.spe1972.goal.primary | Keep all 3 astronauts safe until the storm is over. |
| crisis.spe1972.goal.stretch | Get through the storm without breaking any machines. |
| crisis.mirFire.goal.primary | Put out the fire. Keep all 6 people safe. |
| crisis.mirFire.goal.stretch | Put out the fire and clear the smoke. Keep the power on. |

## Section 4B — Other strings above grade 6 (21 non-goal strings)
| Key | New Cadet text | Note |
|---|---|---|
| noChoicePhrase | If you don't choose: | |
| incident.spe-1972.response.shelterNow.mechanism | Everyone goes to the room with the thickest walls. | |
| incident.o2tank-apollo13.response.improviseAdapter.mechanism | You tape a spare air filter so it fits a hole it wasn't made for. This is the real "mailbox" fix from Apollo 13. | |
| incident.coolant-ms22.response.rideItOut.mechanism | You change nothing. Everything keeps running, and it keeps getting hotter. | Matches the incident: it is OVERHEATING. |
| incident.o2tank-apollo13.response.noResponse.mechanism | You swap nothing. The air cleaner keeps falling behind. | |
| spaceWeatherType.SEP | Radiation burst | Leave. Under 4 words. |
| spaceWeatherType.GST | Magnetic storm | Leave. Under 4 words. |
| crew.co2Idlh | The air is not safe. {crew} needs help now! | |
| incident.o2tank-apollo13.detected | You spotted the oxygen problem! | Leave if still above 5. "Oxygen" is a core term. |
| decision.waterReclamationMode.set | The water recycler is now on {waterReclamationMode}. | BUG: see Section 5, item 9. |
| incident.o2tank-apollo13.queued | Working on the oxygen problem: {response}. About {hoursRemaining} more hour(s). | |
| power.batteryDepleted | The batteries are empty. Not enough power is coming in. | |
| incident.o2tank-apollo13.responseImpossible | No one is free to try {response} right now. | |
| incident.fire-mir97.extinguishersExhausted | The fire extinguishers ran out. Fighting the fire got harder and the crew was in more danger. | Calm wording; no injuries described. |
| incident.fire-mir97.respiratorsExhausted | The best mask filters ran out. The crew is using weaker ones for now. | |
| incident.spe-1972.spike | Radiation is spiking fast! | Leave. Under 4 words. |
| radiation.aboveDesignTarget | There is more space radiation than usual. | Leave if still above 5. "Radiation" is a core term. |
| hazard.dustStorm.obscuring | Dust covers the solar panels. | |
| incident.coolant-ms22.overheating | It is getting hotter inside: up {riseC} degrees. | BUG: see Section 5, item 2. |
| isru.passedMoxieMissionTotal | Your air machine beat the real MOXIE! It made more oxygen than MOXIE did on its whole Mars mission. | |
| incident.duststorm-2018.severe | Dust covers nearly all the solar panels. | |

---

## Section 5 — Problems found while rewriting (for the science teammate and Claude Code)

Fix these in the SPECIALIST and COMMANDER text too, not only Cadet.

1. JEZERO GOAL TEXT IS WRONG. Both Cadet and Specialist say "keep everything working" or "keep every system running". The code no longer requires that (M7.7 removed it). The true goal is: science target met, every living crew member under the career dose limit, all crew alive. Suggested Specialist text: "Meet the science target, keep every crew member under the radiation limit, and bring the whole crew home."
2. MS-22 OVERHEATING TEXT SAYS THE OPPOSITE. incident.coolant-ms22.overheating says "colder" (Cadet) and "dropping" (Specialist), but the incident is a coolant leak that makes the cabin HOTTER, and the variable is named riseC. Check the sign of the value in the engine, then fix whichever is wrong.
3. 1972 STORM FRAMING IS INCONSISTENT. The tagline says "Translunar Space", the scenario is on the lunar surface at Shackleton Ridge (an Artemis-era site), and the briefing says a crew was outside. In 1972 nobody was outside; the event fell between Apollo 16 and 17. Label it honestly as a "what if", as the Cadet text now does.
4. 1972 STORM NUMBERS DON'T MATCH OUR OWN SOURCES. The Specialist text gives "over 4,000 mSv within 18 hours", ">400 rem", and "70,000 protons/cm²-s-sr". None of these has a source ID. Our sourced anchor is ">0.5 Gy over several hours" for a large unshielded event [HRP-ARS], and the engine's spe1972DoseMultiplier gives about 0.5 Gy over 6 hours. Reconcile them, or remove the unsourced numbers. Skin dose and blood-forming-organ dose differ, which may explain part of the gap.
5. "LARGEST" CLAIM. "The largest solar particle event of the space age" should be checked. If it can't be sourced, use "one of the largest".
6. MIR FIRE FACTS DISAGREE WITH OUR RESEARCH. The briefing says "four" extinguishers; our incident catalog says three. It names "both cosmonauts and Jerry Linenger" (3 people) while the goal says 6 people. It also states "22:35 Moscow time", "IP-4 gas masks", and a blocked path to Soyuz TM-24. Verify each against NASA SP-4030 or the Shuttle–Mir history pages, and make the counts match the catalog. The Cadet text avoids the extinguisher count for now.
7. FIRST LIGHT step 6 says the same choice is forced by "Jezero's own dust storm". It is Jezero's pump failure (day 12). Fix the Specialist text.
8. FIRST LIGHT step 7 says there is "no partial credit". The game has Partial and Abort outcomes, so this contradicts scoring. Remove it from the Specialist text.
9. RAW MODE ID IN THE LOG. decision.waterReclamationMode.set prints {waterReclamationMode}, which may show an internal id such as "brineProcessor" to a child. Map each mode to a Cadet label, for example "normal" and "extra clean".
10. LONG NIGHT temperature: the Specialist text says -178°C; the constants say the lunar equator reaches -173°C. Use the scenario's own value and cite it.
11. APOLLO 13 return time: the real return after the explosion was closer to 3.6 days (about 87 hours). The Cadet text says "almost 4 days".

## Script and process fixes (Claude Code)
- Strip or replace {placeholders} with a one-syllable word BEFORE scoring. Several "above 6" strings in Section 4B were inflated by tokens like {waterReclamationMode} counted as long words.
- Ignore strings under 4 words. Flesch–Kincaid is meaningless there.
- Re-score every row above, report any still above 5, and iterate on those only.
- Keep Specialist keys as they are; add Cadet keys beside them.

## Sign-off checklist
| Section | Science teammate (accuracy) | Two kids read aloud | Bangla export |
|---|---|---|---|
| 1 Mission guides | ☐ | ☐ | ☐ |
| 2 Crisis briefings | ☐ | ☐ | ☐ |
| 3 Debrief and ScoreCard | ☐ | ☐ | ☐ |
| 4A Goals | ☐ | ☐ | ☐ |
| 4B Other strings | ☐ | ☐ | ☐ |
| 5 Problems found | ☐ fixed in Specialist text | ||
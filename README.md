[![make.fun · u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d?utm_source=github&utm_medium=readme&utm_campaign=u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d)
[![rank](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d/zeromix555/u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d-entry/rank.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d)
[![reward](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d/zeromix555/u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d-entry/reward.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d?utm_source=github&utm_medium=readme&utm_campaign=u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d)

# No Quit Button — Meme Sprint: AI Agents Ship Games

A funny meme about AI agents building games and apps, built for the make.fun competition
[Meme Sprint: AI Agents Ship Games](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-ai-agents-ship-games-6a92c84d).

## The joke

> MY AI AGENT SHIPPED 47 GAMES TODAY
>
> *(a game screen: YOU WIN! LEVEL 47 COMPLETE — SHIPPING... 47/47 DONE)*
>
> NONE OF THEM HAVE A **QUIT BUTTON**
>
> *(CTRL+ALT+DEL ALSO SHIPS A NEW GAME)*

The agent ships at superhuman speed — and every single game it ships is missing the one button that would let you stop playing.

## How it is built

`main.ts` (Node 22, stdlib only) draws the whole meme with its own 5x7 pixel font and its own pure-TypeScript PNG encoder — no network, no dependencies, no image assets. Run it and it writes `/output/entry.png` (1024x1024, ~12 KB). Run it twice and the outputs are byte-identical.

```
node main.ts
```

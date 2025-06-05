export const aboutRevnetPrompt = `
## About Revnets

A revnet is a tokenized financial structure designed to align incentives among leaders, workers, investors, and customers. It operates like a digital vending machine that issues tokens in exchange for revenue, with predetermined rules governing token price, distribution, and cash-out mechanisms.

Revnets offer a promising solution as an all-in-one, tokenized incentive machine, cap table, and capital formation engine. They provide:

- An open source and openly-accounted-for standard to fund and distribute business offerings, open source projects, campaigns, indie media, and cultural movements.
- A system that operates without governance risks, liquidity requirements, or management overhead.
- A flexible structure simple enough for a group of friends, yet powerful enough for high net-worth, global communities, products, and brands.

Revnets are a fully pre-configured financial structure – although they can evolve over time, they do so according to rules which are set in place at the time of their creation. Think of it like a fancy Bitcoin halvening rule. This means:

- Governance-free: Governance inefficiencies and takeovers of funds – among the most common failure modes for DAOs – are impossible.
- Management-free: Revnets operate autonomously, according to their pre-configured rules.
- Deterministic: Investors, builders, community, and customers know that each revnet's rules will be enforced programmatically from start to finish.
- Familiar: Transparency and diligence are simple. Once one revnet's workings makes sense, all revnets make sense.

## About Revnet Terms
TOKEN issuance and cash out terms evolve over time automatically in stages.

Each revnet has a token and is defined in stages. Each stage specifies five rules which dictate how the revent operates:

- Duration: How long does the stage last? A revnet’s final stage lasts forever.

- Price:
  - Starting price: How much does it cost to buy a single token when the stage begins? The payment's value stays within the revnet and can only be accessed by token holders who cash out.
  - Price increase: How frequently, and by how much, does the token's price increase within the stage?

- Split: What percentage of token issuance (and buybacks) are set aside for a list of recipients, and which address is the split operator? The split operator can add, remove, or modify recipients from that list, changing how the split is allocated within the fixed percent set for the stage.

- Automint: How many tokens get minted to a list of recipients at the start of the stage? This functions like a "pre-mint" only accessible once the stage has started.

- Cash out tax: How much does the revnet's next potential cash out value increase each time a token holder cashes out?

### $REV - stages

You can analyze the following example of $REV revnet to understand how it works.

$REV runs on its own as a revnet according to the rules below – there is no governance. RRG is a token holder alongside other token holders and has no special powers. Anyone can participate in $REV at any time.

### $REV stage 1
Inaugural 77 day $REV sale ⏩. Your payments are worth 2.5x what they'll be worth in stage 2. Mint the first of two batches of tokens to honor pre-launch work.

Duration: 77 days.
Initial price: 1 $REV costs 0.001 ETH.
Price increase: None.
Split: 20% split of issuance and buybacks operated by rrg.rev.eth. 10% routed to rrg.rev.eth (RRG), and 10% to dao.jbx.eth (JuiceboxDAO).
Automint: 70_000 $REV to rrg.rev.eth for pre-launch work. Of this $REV, 25_000 will be sent to dao.jbx.eth (JuiceboxDAO), 10_000 to breadfruit.eth, 10_000 to filipv.eth, 10_000 to codalabs.eth, 4_000 to openesquire.eth, 2_000 to kmacb.eth, 2_000 to 0xba5ed.eth, 2_000 to noobwonder.eth, 2_000 to Peel, 1_000 to drgorilla.eth, 1_000 to Juicecast, 1_000 to peacenode.eth, and 1_000 to LJ.
Cash out tax: Medium-high (0.6). The network consolidates when holders cash out.

### $REV stage 2
The price of issuing new $REV is doubled every 77 days for 770 days.

Duration: 770 days (~2 years).
Initial price: 1 $REV costs 0.002 ETH, double the price of stage 1.
Price increase: 100% (double) every 77 days, “halving”.
Split: 38% of issuance and buybacks operated by rrg.rev.eth. 19% routed to rrg.rev.eth, 19% to dao.jbx.eth.
Automint: none.
Cash out tax: No change. Medium-high (0.6).

### $REV stage 3
Vest last $REV for pre-net work.

Duration: 7777 days. (~22 years)
Initial price: Where stage 2 left off.
Price increase: Continue doubling every 77 days.
Split: No change. 38% of issuance and buybacks operated by rrg.rev.eth. 19% routed to rrg.rev.eth, 19% to dao.jbx.eth.
Automint: 128_000 $REV to rrg.rev.eth for pre-net work. Of this $REV, 35_000 will be sent to dao.jbx.eth, 20_000 to breadfruit.eth, 20_000 to filipv.eth, 20_000 to codalabs.eth, 10_000 to openesquire.eth, 5_000 to kmacb.eth, 5_000 to 0xba5ed.eth, 5_000 to noobwonder.eth, 5_000 to Peel, 1_000 to drgorilla.eth, 1_000 to Juicecast, 1_000 to peacenode.eth, and 1_000 to LJ.
Cash out tax: No change. Medium-high (0.6).

### $REV stage 4
End issuance and splits.

Duration: Forever.
Initial price: 0. No more issuance.
Price increase: None, since there's no more issuance.
Split: None.
Cash out tax: No change. Medium-high (0.6).



`;

const Discord = require('discord.js');
let GiveawaySchema = require(`./../models/giveaway`)
let AfkSchema = require(`./../models/afk`)
const { MessageEmbed } = require('discord.js');

module.exports = async (client) => {
  console.log([
    `Logged in as ${client.user.tag}`,
    `Loaded ${client.commands.size} commands!`,
    `Loaded ${client.events.size} events!`
  ].join('\n'));
  client.user.setActivity("in Trixter Community");
  setInterval(async () => {
    let afk = await AfkSchema.find({});
    for (let i = 0; i < afk.length; i++) {
      if (afk[i].timer !== null) {
        if (Date.now() > afk[i].timer) {
          let user = client.users.cache.get(afk[i].user);
          let server = client.guilds.cache.get(afk[i].guild);
          user.send(`Removed your afk of ${afk[i].message} in ${server.name}.`)
          await AfkSchema.findOneAndDelete({ guild: afk[i].guild, user: afk[i].user }, (err, res) => {
            if (err) return console.log(err);
          })
        }
      }
    }
  }, 10000);
  setInterval(async () => {
    let Giveaways = await GiveawaySchema.find({ enabled: true });
    if (!Giveaways) return;
    Giveaways.forEach(async (giveaway) => {
      const embed = new MessageEmbed(giveaway.embed);
      let channel = await client.channels.cache.get(giveaway.channel);
      if (!channel) {
        await GiveawaySchema.deleteOne({ id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId })
        return;
      }
      let msg = await channel.messages.fetch(giveaway.msgId);
      if (!msg) {
        await GiveawaySchema.deleteOne({ id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId })
        return;
      }

      if (Date.now() > giveaway.time) {

        const reaction = msg.reactions.cache.get("🎉");


        let users = await fetchReactedUsers(reaction);


        const list = await users.filter(u => u.bot !== true && u.id !== giveaway.host);

        /*
                if ((list.length === 0 || list.length < giveaway.winnerCount) && giveaway.type === "automatic") {
        
        
                  let prize = giveaway.prize;
        
                  if (giveaway.poke) {
                    let mg = await User.findOne({ id: giveaway.host });
        
                    mg.pokemons.push(giveaway.poke);
        
                    await mg.markModified('pokemons');
        
                    await mg.save().catch(console.error);
                  }
        
                  if (prize.endsWith("c")) {
                    var amount = prize.replace("c", "").replace("k", "000")
                    amount = giveaway.winnerCount * amount
                    var ra = parseInt(amount)
                    let mg = await User.findOne({ id: giveaway.host });
                    const newbal = mg.balance + ra;
                    mg.balance = newbal
                    await mg.save();
                  }
        
                  if (prize.endsWith("credits")) {
                    var amount = prize.replace("credits", "").replace("k", "000")
                    amount = giveaway.winnerCount * amount
                    var ra = parseInt(amount)
                    let mg = await User.findOne({ id: giveaway.host });
                    const newbal = mg.balance + ra;
                    mg.balance = newbal
                    await mg.save();
                  }
                  if (prize.endsWith("coins")) {
                    var amount = prize.replace("coins", "").replace("k", "000")
                    amount = giveaway.winnerCount * amount
                    var ra = parseInt(amount)
                    let mg = await User.findOne({ id: giveaway.host });
                    const newbal = mg.balance + ra;
                    mg.balance = newbal
                    await mg.save();
                  }
                  if (prize.endsWith("pokecoins")) {
                    var amount = prize.replace("pokecoins", "").replace("k", "000")
                    amount = giveaway.winnerCount * amount
                    var ra = parseInt(amount)
                    let mg = await User.findOne({ id: giveaway.host });
                    const newbal = mg.balance + ra;
                    mg.balance = newbal
                    await mg.save();
                  }
                  if (prize.endsWith("coin")) {
                    var amount = prize.replace("coin", "").replace("k", "000")
                    amount = giveaway.winnerCount * amount
                    var ra = parseInt(amount)
                    let mg = await User.findOne({ id: giveaway.host });
                    const newbal = mg.balance + ra;
                    mg.balance = newbal
                    await mg.save();
                  }
                  if (prize.endsWith("pokecoin")) {
                    var amount = prize.replace("pokecoin", "").replace("k", "000")
                    amount = giveaway.winnerCount * amount
                    var ra = parseInt(amount)
                    let mg = await User.findOne({ id: giveaway.host });
                    const newbal = mg.balance + ra;
                    mg.balance = newbal
                    await mg.save();
                  }
                  if (prize.endsWith("redeems")) {
                    var amount = prize.replace("r", "")
                    amount = giveaway.winnerCount * amount
                    var ra = parseInt(amount)
                    let mg = await User.findOne({ id: giveaway.host });
                    const newbal = mg.redeems + ra;
                    mg.redeems = newbal
                    await mg.save();
                  }
                  if (prize.endsWith("redeem")) {
                    var amount = prize.replace("r", "")
                    amount = giveaway.winnerCount * amount
                    var ra = parseInt(amount)
                    let mg = await User.findOne({ id: giveaway.host });
                    const newbal = mg.redeems + ra;
                    mg.redeems = newbal
                    await mg.save();
                  }
                  if (prize.endsWith("r")) {
                    var amount = prize.replace("r", "")
                    amount = giveaway.winnerCount * amount
                    var ra = parseInt(amount)
                    let mg = await User.findOne({ id: giveaway.host });
                    const newbal = mg.redeems + ra;
                    mg.redeems = newbal
                    await mg.save();
                  }
        
        
                }
                */


        if (list.length === 0) {
          embed.description = `Winner: No one.`;
          embed.footer.text = `Giveaway Finished`;

          await GiveawaySchema.deleteOne({ id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId })
          return msg.edit(embed);
        } else if (list.length < giveaway.winnerCount) {
          embed.description = `Winner: Couldn't find enough winners.`;
          embed.footer.text = `Giveaway Finished`;

          await GiveawaySchema.deleteOne({ id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId })
          return msg.edit(embed);
        }
        let winners = [];
        for (let i = 0; i < giveaway.winnerCount; i++) {
          const x = draw(list);

          if (!winners.includes(x)) winners.push(x);
        }

        /*
                if (giveaway.type === "automatic") {
                  const prize = giveaway.prize;
        
        
                  let nwinner = winners.forEach(async w => {
                    console.log(w)
                    if (giveaway.poke) {
                      let mg = await User.findOne({ id: w.id });
        
                      mg.pokemons.push(giveaway.poke);
        
                      await mg.markModified('pokemons');
        
                      await mg.save().catch(console.error);
                    }
        
        
                    if (prize.endsWith("c")) {
                      var amount = prize.replace("c", "").replace("k", "000")
                      var ra = parseInt(amount)
                      let mg = await User.findOne({ id: w.id });
                      const newbal = mg.balance + ra;
                      mg.balance = newbal
                      await mg.save();
                    }
        
                    if (prize.endsWith("credits")) {
                      var amount = prize.replace("credits", "").replace("k", "000")
                      var ra = parseInt(amount)
                      let mg = await User.findOne({ id: w.id });
                      const newbal = mg.balance + ra;
                      mg.balance = newbal
                      await mg.save();
                    }
                    if (prize.endsWith("coins")) {
                      var amount = prize.replace("coins", "").replace("k", "000")
                      var ra = parseInt(amount)
                      let mg = await User.findOne({ id: w.id });
                      const newbal = mg.balance + ra;
                      mg.balance = newbal
                      await mg.save();
                    }
                    if (prize.endsWith("pokecoins")) {
                      var amount = prize.replace("pokecoins", "").replace("k", "000")
                      var ra = parseInt(amount)
                      let mg = await User.findOne({ id: w.id });
                      const newbal = mg.balance + ra;
                      mg.balance = newbal
                      await mg.save();
                    }
                    if (prize.endsWith("coin")) {
                      var amount = prize.replace("coin", "").replace("k", "000")
                      var ra = parseInt(amount)
                      let mg = await User.findOne({ id: w.id });
                      const newbal = mg.balance + ra;
                      mg.balance = newbal
                      await mg.save();
                    }
                    if (prize.endsWith("pokecoin")) {
                      var amount = prize.replace("pokecoin", "").replace("k", "000")
                      var ra = parseInt(amount)
                      let mg = await User.findOne({ id: w.id });
                      const newbal = mg.balance + ra;
                      mg.balance = newbal
                      await mg.save();
                    }
                    if (prize.endsWith("redeems")) {
                      var amount = prize.replace("redeems", "")
                      var ra = parseInt(amount)
                      let mg = await User.findOne({ id: w.id });
                      const newbal = mg.redeems + ra;
                      mg.redeems = newbal
                      await mg.save();
                    }
                    if (prize.endsWith("redeem")) {
                      var amount = prize.replace("redeem", "")
                      var ra = parseInt(amount)
                      let mg = await User.findOne({ id: w.id });
                      const newbal = mg.redeems + ra;
                      mg.redeems = newbal
                      await mg.save();
                    }
                    if (prize.endsWith("r")) {
                      var amount = prize.replace("r", "")
                      var ra = parseInt(amount)
                      let mg = await User.findOne({ id: w.id });
                      const newbal = mg.redeems + ra;
                      mg.redeems = newbal
                      await mg.save();
                    }
                  });
                }
                */



        embed.description = `Winner(s): ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(", ")}`;
        embed.footer.text = `Giveaway Finished`;


        await msg.edit(embed);
        giveaway.enabled = false

        await giveaway.save().catch(e => console.log(e))
        if (winners.length) msg.channel.send(`🎉 Congratulations, ${winners.map(u => u.toString()).join(", ")}! You won the giveaway for **${giveaway.prize}**! 🎉`);


      }
    })
  }, 10000)
}

async function fetchReactedUsers(reaction, after) {
  const opts = { limit: 100, after };
  const reactions = await reaction.users.fetch(opts);
  if (!reactions.size) return [];

  const last = reactions.last().id;
  const next = await fetchReactedUsers(reaction, last);
  return reactions.array().concat(next);
}

function shuffle(arr) {
  for (let i = arr.length; i; i--) {
    const j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
  return arr;
}
function draw(list) {
  const shuffled = shuffle(list);
  return shuffled[Math.floor(Math.random() * shuffled.length)];
}

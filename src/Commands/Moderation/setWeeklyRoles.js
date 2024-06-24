import { ChatInputCommandInteraction, Client } from 'discord.js'
import { PermissionFlagsBits } from 'discord.js'
import { Model, Query } from 'mongoose'
import weeklyLevels from '../../modals/weeklyLevels.js'
import dynamicMembers from '../../modals/dynamicmembers.js'
import heroMember from '../../modals/heromember.js'
import adminChannels from '../../modals/administratorChannels.js'
import botChannel from '../../modals/botAnnouncementChannel.js'
import roles from '../../StoredData/roles.js'

export default {
  name: 'weekly-roles',
  description: 'sets the weekly server roles',
  //   deleted: true,

  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  callback: async (client, interaction) => {
    const dynamicDwellerNames = []
    let hero
    await interaction.deferReply({ ephemeral: true })

    const targetChannel = await adminChannels.findOne({
      guildId: interaction.guild.id,
      channelId: interaction.channel.id
    })

    if (!targetChannel) {
      await interaction.editReply(
        'This command can only be run in an admin channel. To set a channel as admin channel use command: set-admin-channel'
      )
      return
    }

    try {
      let allLevels = await weeklyLevels
        .find({ guildID: interaction.guild.id })
        .select('-_id userID xp level')
      await allLevels

      allLevels.sort((a, b) => {
        if (a.level === b.level) {
          return b.xp - a.xp
        } else {
          return b.level - a.level
        }
      })

      //   console.log(allLevels)

      const length = Math.min(allLevels?.length || 0, 5)
      const newAllLevels = []

      for (let i = 0; i < length; i++) {
        newAllLevels.push(allLevels[i])
      }
      //   console.log('fine till here.....p')
      //   console.log(newAllLevels)

      let allDynamicMembers = await dynamicMembers.find({
        guildId: interaction.guild.id
      })
      await allDynamicMembers

      const dLength = Math.min(allDynamicMembers?.length || 0, 5)
      //checking for each if dynamicDweller still exists in the new data
      for (let i = 0; i < dLength; i++) {
        const targetUserId = allDynamicMembers[i].userId

        const isThere = newAllLevels.find(cmd => cmd.userID === targetUserId)
        // console.log(isThere)

        if (!isThere) {
          const targetUserObj = await interaction.guild.members.fetch(
            targetUserId
          )
          //   console.log('fine till here...')
          const hasRole = targetUserObj.roles.cache.get(
            roles.find(cmd => cmd.label === 'Dynamic-Dwellers').id
          )

          if (!hasRole) continue

          //   console.log('fine till here..')
          targetUserObj.roles.remove(hasRole)
          //   console.log('role removed!')
        } else continue
      }
      //   console.log('fine till here.')

      await dynamicMembers.deleteMany({
        guildId: interaction.guild.id
      })

      const prevHero = await heroMember.findOne({
        guildId: interaction.guild.id
      })
      if (!prevHero) {
        console.log(newAllLevels)
        console.log(newAllLevels[0].userID)

        const newHero = new heroMember({
          userId: newAllLevels[0].userID,
          guildId: interaction.guild.id
        })
        await newHero.save()
      }

      //DCS Heroes role update
      else if (
        !prevHero.userId === newAllLevels[0].userID ||
        '711945113621889186' ||
        '800989617737957397'
      ) {
        const prevHeroObj = await interaction.guild.members.fetch(
          prevHero.userId
        )

        const Hrole = roles.find(cmd => cmd.label === 'DCS-Heroes')

        const HhasRole = prevHeroObj.roles.cache.has(Hrole.id)

        if (HhasRole) prevHeroObj.roles.remove(Hrole.id)
        prevHero.userId = newAllLevels[0].userID
        await prevHero.save()
      }

      const newHeroObj = await interaction.guild.members.fetch(
        newAllLevels[0].userID
      )

      const Crole = roles.find(cmd => cmd.label === 'DCS-Heroes')

      const ChasRole = newHeroObj.roles.cache.has(Crole.id)

      if (!ChasRole) newHeroObj.roles.add(Crole.id)

      hero = newHeroObj.user

      //adding Dynamic role to new active members
      for (let i = 0; i < length; i++) {
        // console.log('fine till here0')
        const targetUserId = newAllLevels[i].userID
        const targetUserObj = await interaction.guild.members.fetch(
          targetUserId
        )

        // console.log('fine till here1')
        if (!targetUserObj) continue

        dynamicDwellerNames.push(targetUserObj.user)
        const newDynamicMember = new dynamicMembers({
          userId: targetUserId,
          guildId: interaction.guild.id
        })

        // console.log('fine till here2')
        await newDynamicMember.save()

        const role = roles.find(cmd => cmd.label === 'Dynamic-Dwellers')

        const hasRole = targetUserObj.roles.cache.has(role.id)

        // console.log('fine till here3')
        if (hasRole) {
          continue
        }

        await targetUserObj.roles.add(role.id)
        // console.log('Role has been added')
      }
      const bChannel = await botChannel.findOne({
        guildId: interaction.guild.id
      })

      if (bChannel) {
        const targetChannel = await interaction.guild.channels.fetch(
          bChannel.channelId
        )
        targetChannel.send(
          `**The roles for this week have been updated!**\n The following people got the Dynamic-Dwellers role due to being active:\n 1) ${
            dynamicDwellerNames[0] || '*Null*'
          } \n 2) ${dynamicDwellerNames[1] || '*Null*'} \n 3) ${
            dynamicDwellerNames[2] || '*Null*'
          } \n 4) ${dynamicDwellerNames[3] || '*Null*'} \n 5) ${
            dynamicDwellerNames[4] || '*Null*'
          } \n \n **The member who was most active and received the Heroes role is:** ${
            hero || 'User unavailable'
          }\n Congratulations!`
        )
      }
      await interaction.editReply(`All roles have been updated successfully!`)
    } catch (error) {
      console.log('There was an error in weeklyRoles', error)
    }
  }
}

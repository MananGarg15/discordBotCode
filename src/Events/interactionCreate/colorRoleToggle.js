export default async (client, interaction) => {
  try {
    if (!interaction.isButton()) return

    await interaction.deferReply({ ephemeral: true })

    const role = interaction.guild.roles.cache.get(interaction.customId)
    if (!role) {
      interaction.editReply({
        content: "I couldn't find the role"
      })
      return
    }

    const hasRole = interaction.member.roles.cache.has(role.id)

    if (hasRole) {
      await interaction.member.roles.remove(role)
      await interaction.editReply('The role has been removed')
      return
    }

    if (!hasRole) {
      await interaction.member.roles.add(role)
      await interaction.editReply('The role has been added')
      return
    }
  } catch (error) {
    console.log(error)
  }
}

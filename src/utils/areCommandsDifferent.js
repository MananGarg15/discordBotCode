export default async (localCommand, existingCommand) => {
  //   console.log(existingCommand?.options[1]?.choices)
  const areChoicesDifferent = async (localChoices, existingChoices) => {
    for (const localChoice of localChoices) {
      const existingChoice = await existingChoices?.find(
        choice => choice.name === localChoice.name
      )
      if (!existingChoice) return true

      if (existingChoice) {
        if (localChoice.value !== existingChoice.value)
          //   console.log('Here lies the problem')

          return true
      }
    }
    return false
  }

  const areOptionsDifferent = async (localOptions, existingOptions) => {
    for (const localOption of localOptions) {
      const existingOption = await existingOptions?.find(
        opt => opt.name === localOption.name
      )

      if (!existingOption) return true

      if (existingOption) {
        if (
          localOption.description !== existingOption.description ||
          localOption.type !== existingOption.type ||
          (localOption.required || false) !==
            (existingOption.required || false) ||
          (localOption.choices?.length || 0) !==
            (existingOption.choices?.length || 0) ||
          (await areChoicesDifferent(
            localOption.choices || [],
            existingOption.choices || []
          ))
        )
          return true
      }
    }
    return false
  }

  if (
    localCommand.description !== existingCommand.description ||
    (localCommand.options?.length || 0) !==
      (existingCommand.options?.length || 0) ||
    (await areOptionsDifferent(
      localCommand.options || [],
      existingCommand.options || []
    ))
  ) {
    return true
  }

  return false
}

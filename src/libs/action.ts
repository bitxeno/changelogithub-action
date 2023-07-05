import { getInput, type InputOptions, setOutput } from '@actions/core'
import { type ChangelogOptions } from 'changelogithub'

export function getInputOptions(): ChangelogOptions {
  const inputs = {
    capitalize: getBooleanInput('capitalize'),
    contributors: getBooleanInput('contributors'),
    draft: getBooleanInput('draft'),
    dry: getBooleanInput('dry'),
    // https://github.com/antfu/changelogithub/blob/main/src/cli.ts#L20
    emoji: getBooleanInput('emoji') ?? true,
    from: getStringInput('from'),
    github: getStringInput('github'),
    group: getBooleanInput('group'),
    name: getStringInput('name'),
    prerelease: getBooleanInput('prerelease'),
    to: getStringInput('to'),
    token: getStringInput('token', { required: true }),
  }

  const options: ChangelogOptions = {}

  // https://github.com/actions/toolkit/issues/272
  for (const [key, value] of Object.entries(inputs)) {
    if (value !== undefined) {
      Object.assign(options, { [key]: value })
    }
  }

  return options
}

export function setChangelogOutput(md: string) {
  setOutput('summary', md)
}

function getStringInput(name: string, options?: InputOptions) {
  const input = getInput(name, options)

  if (input === '') {
    return undefined
  }

  return input
}

function getBooleanInput(name: string, options?: InputOptions) {
  const input = getInput(name, options)

  if (input === '') {
    return undefined
  }

  return input === 'true'
}
import { getInput, getMultilineInput, type InputOptions, setOutput } from '@actions/core'
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
    token: getStringInput('token'),
    types: {
      feat: { title: '🚀 Features' },
      fix: { title: '🐞 Bug Fixes' },
      perf: { title: '🏎 Performance' },
      refactor: { title: "💅 Refactors" },
      improve: { title: "💡 Improvements" },
      tweak: { title: "🔧 Tweaks" },
      docs: { title: "📖 Documentation" },
      build: { title: "📦 Build" },
      types: { title: "🌊 Types" },
      chore: { title: "🏡 Chore" },
      examples: { title: "🏀 Examples" },
      test: { title: "✅ Tests" },
      style: { title: "🎨 Styles" },
      ci: { title: "🤖 CI" },
    },
  }

  const options: ChangelogOptions = {}

  // https://github.com/actions/toolkit/issues/272
  for (const [key, value] of Object.entries(inputs)) {
    if (value !== undefined) {
      if (key == "types") {
        let types = getMultilineInput('types')
        if (types.length > 0) {
          Object.assign(options, { [key]: Object.fromEntries(Object.entries(value).filter(([key]) => types.includes(key))) })
        } else {
          Object.assign(options, { [key]: value })
        }

      } else {
        Object.assign(options, { [key]: value })
      }
    }
  }

  return options
}



export function getStringInput(name: string, options?: InputOptions) {
  const input = getInput(name, options)

  if (input === '') {
    return undefined
  }

  return input
}

export function getBooleanInput(name: string, options?: InputOptions) {
  const input = getInput(name, options)

  if (input === '') {
    return undefined
  }

  return input === 'true'
}
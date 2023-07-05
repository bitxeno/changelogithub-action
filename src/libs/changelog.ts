import { info, setFailed } from '@actions/core'
import { generate, hasTagOnGitHub, isRepoShallow } from 'changelogithub'

import { getInputOptions, setChangelogOutput } from './action'

export async function generateChangelog() {
  try {
    const inputOptions = getInputOptions()

    const { commits, config, md } = await generate(inputOptions)

    if (config.dry) {
      info('Dry run. Release skipped.')
      return
    }

    if (!config.token) {
      throw new Error('No GitHub token found, specify it via the `token` action input. Release skipped.')
    }

    if (!(await hasTagOnGitHub(config.to, config))) {
      throw new Error(`Current ref "${config.to}" is not available as tags on GitHub. Release skipped.`)
    }

    setChangelogOutput(md)

    if (commits.length === 0 && (await isRepoShallow())) {
      throw new Error(
        'The repo seems to be cloned shallowly, which make changelog failed to generate. You might want to specify `fetch-depth: 0` in your CI config.'
      )
    }
  } catch (error) {
    setFailed(`Action changelogithub failed with error: ${error instanceof Error ? error.message : String(error)}`)
  }
}
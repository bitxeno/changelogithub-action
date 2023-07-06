import { info, setFailed, setOutput } from '@actions/core'
import * as fs from 'fs/promises';
import * as path from 'path'
import { generate, hasTagOnGitHub, isRepoShallow, ChangelogOptions, sendRelease } from 'changelogithub'

import { getInputOptions, getStringInput } from './action'

export async function run() {
  try {
    const inputOptions = getInputOptions()
    await generateChangelog(inputOptions)
  } catch (error) {
    setFailed(`Action changelogithub failed with error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function generateChangelog(inputOptions: ChangelogOptions) {
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

  let changelog = md.replace('### &nbsp;&nbsp;&nbsp;', '## ')
    .replace('##### &nbsp;&nbsp;&nbsp;&nbsp;', '**Full Changelog**: ')
    .replace('View changes on GitHub', `${config.from}...${config.to}`)
  setOutput('changelog', changelog)

  await setFileChangelogOutput(config, md)

  if (commits.length === 0 && (await isRepoShallow())) {
    throw new Error(
      'The repo seems to be cloned shallowly, which make changelog failed to generate. You might want to specify `fetch-depth: 0` in your CI config.'
    )
  }
}


async function setFileChangelogOutput(config: ChangelogOptions, md: string) {
  let d = new Date()
  let year = d.getFullYear()
  let month = (d.getMonth() + 1).toString().padStart(2, '0')
  let day = d.getDate().toString().padStart(2, '0')
  let header = `## ${config.to} (${year}-${month}-${day})\n`
  let changelog = md.replace(/##### &nbsp;&nbsp;&nbsp;&nbsp;.+/i, '')

  setOutput('changelog_with_version', header + changelog)

  let outputFile = getStringInput('output-file')
  if (outputFile && outputFile != '') {
    let dir = path.dirname(outputFile)
    if (dir != '' && dir != '.' && dir != '/') {
      await fs.mkdir(dir, { recursive: true })
    }
    await fs.appendFile(outputFile, header + changelog)
  }
}
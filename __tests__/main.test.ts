import * as process from "process";
import { beforeEach, afterEach, assert, expect, test, vi } from 'vitest'
import { ChangelogOptions } from 'changelogithub'

import { getInputOptions } from "../src/libs/action";
import { generateChangelog } from '../src/libs/changelog'

vi.mock("changelogithub", async () => {
  const actual = await vi.importActual<typeof import("changelogithub")>("changelogithub");
  return {
    ...actual,
    hasTagOnGitHub: vi.fn().mockResolvedValue(true),
  };
})

vi.mock('@actions/core', async () => {
  const actual = await vi.importActual<typeof import('@actions/core')>('@actions/core');
  return {
    ...actual,
    setOutput: vi.fn().mockImplementation(function (name: string, value: any) {
      console.log(`OUTPUT[${name}]:`)
      console.log(value)
    }),
    setFailed: vi.fn().mockImplementation(function (message: string | Error) {
      if (message instanceof Error) {
        throw message
      } else {
        throw new Error(message)
      }
    })
  };
})

beforeEach(() => {
});

afterEach(() => {
  // clean all env
  Object.entries(process.env).forEach(([key, value]) => {
    delete process.env[key]
  })
});

test("test input default", async () => {
  const inputOptions = getInputOptions()

  console.log(inputOptions)
});

test("test input", async () => {
  process.env["INPUT_TOKEN"] = "xxx";
  process.env["INPUT_TYPES"] = 'ci\nfix';


  const inputOptions = getInputOptions()
  console.log(inputOptions)
});

test("test generate log", async () => {
  // const mock = await vi.importMock<typeof import('../src/libs/changelog')>('../src/libs/changelog')
  // mock.hasTag = vi.fn().mockResolvedValue(true)
  // process.env["INPUT_OUTPUT-FILE"] = 'CHANGELOG.md';

  const options: ChangelogOptions = {
    token: 'xxx',
    github: "bitxeno/changelogithub-action",
    from: 'v1.0.3',
    to: 'v1.0.4',
  }
  await generateChangelog(options)
});

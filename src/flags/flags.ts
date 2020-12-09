interface Logger {
  log: (...str: string[]) => void
}

interface Flag {
  description: string
  flag: string
  fallback: number | string
}

export default class FlagSet {
  #args: string[]
  #logger: Logger
  #name: string
  #flags: { [flag: string]: Flag } = {}

  constructor(name: string, args: string[], logger: Logger) {
    this.#args = args
    this.#logger = logger
    this.#name = name
  }

  #getFlag = (flag: string): Flag => {
    if (Object.prototype.hasOwnProperty.call(this.#flags, flag)) {
      return this.#flags[flag]
    }
    return { description: '', flag: '', fallback: '' }
  }

  #getArgValue = (arg: string): string | undefined => {
    const index = this.#args.indexOf(`-${arg}`)
    if (index > -1) {
      return this.#args[index + 1] as string | undefined
    }
    return ''
  }

  #printHelp = (undefinedArgs?: string): void => {
    const unknownOptions =
      undefinedArgs !== undefined
        ? 'Unknown Options: \n' + undefinedArgs + '\n'
        : ''
    let helpMsg = this.#name + '\n' + unknownOptions + 'Options: \n'

    for (const flag in this.#flags) {
      if (Object.prototype.hasOwnProperty.call(this.#flags, flag)) {
        const { description, fallback } = this.#flags[flag]
        helpMsg += `\t-${flag}\t${description} - (default: <${typeof fallback}> ${fallback})`
      }
    }
    this.#logger.log(helpMsg)
  }

  int = (flag: string, fallback: number, description: string): number => {
    this.#flags[flag] = { description, flag, fallback }
    const v = this.#getArgValue(flag)
    if (v !== '' && v !== undefined) {
      const parsedValue = parseInt(v)
      if (!isNaN(parsedValue)) {
        return parsedValue
      }
    }
    return fallback
  }

  str = (flag: string, fallback: string, description: string): string => {
    this.#flags[flag] = { description, flag, fallback }
    const v = this.#getArgValue(flag)
    if (v !== '' && v !== undefined) {
      return v
    }
    return fallback
  }

  parse = (exitProcess = true): void => {
    if (!this.#args.includes('-help')) {
      // look at all the args and find any that aren't defined
      const flagMap = new Map<string, string>()

      for (let i = 0; i < this.#args.length; i++) {
        let v: string = this.#args[i]
        let k: string = v
        if (v.indexOf('-') === 0) {
          flagMap.set(k, 'true')
          continue
        } else if (this.#args[i - 1] !== undefined) {
          // is previous arg a flag?
          k = this.#args[i - 1].indexOf('-') === 0 ? this.#args[i - 1] : v
          v = k !== v ? v : 'true'
        }
        flagMap.set(k, v)
      }

      flagMap.forEach((value, key) => {
        if (key.indexOf('-') === 0 && this.#getFlag(key.slice(1)).flag !== '') {
          flagMap.delete(key)
        }
      })

      if (flagMap.size > 0) {
        const undefinedArgs: string = Array.from(flagMap).reduce(
          (c, t): string => {
            const key = t[0]
            const val = t[1]
            return `${c}  "${key}" => "${val}"\n`
          },
          ''
        )
        this.#printHelp(undefinedArgs)
        /* istanbul ignore next */
        if (exitProcess) {
          // should this exit w/ 1?
          process.exit(0)
          return
        }
      }
      return
    }
    this.#printHelp()
    /* istanbul ignore next */
    if (exitProcess) {
      process.exit(0)
    }
  }
}

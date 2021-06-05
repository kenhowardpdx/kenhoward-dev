/* eslint-disable @typescript-eslint/no-explicit-any */
import FlagSet from '../flags'

describe('flags', (): void => {
  describe('parse', (): void => {
    test('prints help when -help flag encountered', (): void => {
      expect.assertions(1)

      const want =
        'test\nOptions: \n\t-foo\tfoo is great - (default: <string> great)'
      const logger = {
        log: jest.fn() as any
      }

      const flags = new FlagSet('test', ['-help'], logger)
      flags.str('foo', 'great', 'foo is great')
      flags.parse(false)

      expect(logger.log).toHaveBeenCalledWith(want)
    })
    test('prints help when undefined flag encountered', (): void => {
      expect.assertions(1)

      const want =
        /^test\nUnknown Options: \n\s{2}"-undefined" => "true"\n\s{2}"-nope" => "false"\n\s{2}"not-defined" => "true"\n\nOptions:\s\n/
      const logger = {
        log: jest.fn() as any
      }

      const flags = new FlagSet(
        'test',
        ['-undefined', '-nope', 'false', 'not-defined'],
        logger
      )
      flags.str('defined', 'sure is', 'this is a defined flag')
      flags.parse(false)

      expect(logger.log).toHaveBeenCalledWith(expect.stringMatching(want))
    })
    test('retuns without printing when flags provided are defined', (): void => {
      expect.assertions(1)

      const logger = {
        log: jest.fn() as any
      }

      const flags = new FlagSet('test', ['-foo'], logger)
      flags.int('foo', 100, 'baz')
      flags.parse(false)

      expect(logger.log).not.toHaveBeenCalled()
    })
  })
  describe('int', (): void => {
    test('return default value when flag not set', (): void => {
      expect.assertions(1)

      const logger = {
        log: jest.fn() as any
      }

      const want = 100
      const flags = new FlagSet('test', [], logger)
      const got = flags.int('foo', 100, 'baz')

      expect(got).toStrictEqual(want)
    })
    test('return flag value when flag is set', (): void => {
      expect.assertions(1)

      const logger = {
        log: jest.fn() as any
      }

      const want = 200
      const flags = new FlagSet('test', ['-foo', '200'], logger)
      const got = flags.int('foo', 100, 'baz')

      expect(got).toStrictEqual(want)
    })
    test('return default value when flag is improperly set', (): void => {
      expect.assertions(1)

      const logger = {
        log: jest.fn() as any
      }

      const want = 100
      const flags = new FlagSet('test', ['-foo', 'two-hundred'], logger)
      const got = flags.int('foo', 100, 'baz')

      expect(got).toStrictEqual(want)
    })
  })
  describe('str', (): void => {
    test('return default value when flag not set', (): void => {
      expect.assertions(1)

      const logger = {
        log: jest.fn() as any
      }

      const want = 'bar'
      const flags = new FlagSet('test', [], logger)
      const got = flags.str('foo', 'bar', 'baz')

      expect(got).toStrictEqual(want)
    })
    test('return flag value when flag is set', (): void => {
      expect.assertions(1)

      const logger = {
        log: jest.fn() as any
      }

      const want = 'not-bar'
      const flags = new FlagSet('test', ['-foo', 'not-bar'], logger)
      const got = flags.str('foo', 'bar', 'baz')

      expect(got).toStrictEqual(want)
    })
    test('return default value when flag provided but not set', (): void => {
      expect.assertions(1)

      const logger = {
        log: jest.fn() as any
      }

      const want = 'bar'
      const flags = new FlagSet('test', ['-foo'], logger)
      const got = flags.str('foo', 'bar', 'baz')

      expect(got).toStrictEqual(want)
    })
  })
})

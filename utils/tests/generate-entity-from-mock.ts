/**
 * Creates an object with the same properties as the provided entity,
 * but with mocked values
 *
 * @param original Entity to use as base for the mock
 * @param overrides Object containing the properties to override
 * @returns The mocked object, overriding the original properties with the ones provided
 */
export const generateEntityFromMock =
  <T extends {}>(original: T) =>
  <K extends Partial<T>>(overrides?: K) =>
    Object.assign({}, original, overrides) as T & K

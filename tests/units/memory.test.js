const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('In-Memory Fragment Database', () => {
  const ownerId = 'testOwner';
  const fragmentId = 'testFragment';
  const fragmentData = { id: fragmentId, ownerId, content: 'Hello, World!' };
  const fragmentBuffer = Buffer.from('Sample data');

  beforeEach(async () => {
    // Reset the database by deleting any existing fragments and their data
    await deleteFragment(ownerId, fragmentId).catch(() => {});
  });

  test('writeFragment and readFragment', async () => {
    await writeFragment(fragmentData);
    const result = await readFragment(ownerId, fragmentId);
    expect(result).toEqual(fragmentData);
  });

  test('readFragment returns undefined for non-existing fragment', async () => {
    const result = await readFragment(ownerId, 'nonExistingFragment');
    expect(result).toBe(undefined);
  });

  test('writeFragmentData and readFragmentData', async () => {
    await writeFragmentData(ownerId, fragmentId, fragmentBuffer);
    const result = await readFragmentData(ownerId, fragmentId);
    expect(result).toEqual(fragmentBuffer);
  });

  test('readFragmentData returns undefined for non-existing data', async () => {
    const result = await readFragmentData(ownerId, 'nonExistingData');
    expect(result).toBe(undefined);
  });

  test('listFragments returns fragment IDs', async () => {
    await writeFragment(fragmentData);
    const result = await listFragments(ownerId);
    expect(result).toEqual([fragmentId]);
  });

  test('listFragments returns expanded fragments', async () => {
    await writeFragment(fragmentData);
    const result = await listFragments(ownerId, true);
    expect(result).toEqual([fragmentData]);
  });

  test('listFragments returns empty array when no fragments exist', async () => {
    const result = await listFragments(ownerId);
    expect(result).toEqual([]);
  });

  test('deleteFragment removes fragment metadata and data', async () => {
    await writeFragment(fragmentData);
    await writeFragmentData(ownerId, fragmentId, fragmentBuffer);
    await deleteFragment(ownerId, fragmentId);
    const metadataResult = await readFragment(ownerId, fragmentId);
    const dataResult = await readFragmentData(ownerId, fragmentId);
    expect(metadataResult).toBe(undefined);
    expect(dataResult).toBe(undefined);
  });

  test('deleteFragment throws if fragment does not exist', async () => {
    await expect(deleteFragment(ownerId, 'nonExistingFragment')).rejects.toThrow();
  });
});

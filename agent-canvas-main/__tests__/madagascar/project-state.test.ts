import { beforeEach, describe, expect, it } from "vitest";
import {
  getLegacyProjectStateKeys,
  getDefaultProjectState,
  readProjectStateWithMigration,
} from "#/madagascar/project-state";

const projectRoot = "C:/projects/madagascar";
const stateKey = `madagascar-project:${encodeURIComponent(projectRoot)}`;

function legacyState(selectedAnimal = "owl") {
  return {
    selectedAnimal,
    permission: "execute",
    conversationIds: ["conversation-1"],
    openFilePaths: ["README.md"],
    activeFilePath: "README.md",
    updatedAt: "2026-07-18T00:00:00.000Z",
  };
}

describe("Madagascar project-state migration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("copies a known legacy state key and reports its source", () => {
    const [legacyKey] = getLegacyProjectStateKeys(projectRoot);
    localStorage.setItem(legacyKey, JSON.stringify(legacyState()));

    const result = readProjectStateWithMigration(projectRoot);

    expect(result.state.selectedAnimal).toBe("owl");
    expect(result.state.permission).toBe("execute");
    expect(result.migration).toMatchObject({ sourceKey: legacyKey });
    expect(localStorage.getItem(stateKey)).toBe(JSON.stringify(result.state));
    expect(localStorage.getItem(legacyKey)).toBe(JSON.stringify(legacyState()));
  });

  it("ignores malformed and unsupported legacy values", () => {
    const [malformedKey, unsupportedKey] = getLegacyProjectStateKeys(projectRoot);
    localStorage.setItem(malformedKey, "not json");
    localStorage.setItem(unsupportedKey, JSON.stringify({ obsolete: true }));

    const result = readProjectStateWithMigration(projectRoot);

    expect(result).toEqual({
      state: getDefaultProjectState(projectRoot),
      migration: null,
    });
    expect(localStorage.getItem(stateKey)).toBeNull();
  });

  it("keeps valid Madagascar state when legacy state is also present", () => {
    const [legacyKey] = getLegacyProjectStateKeys(projectRoot);
    localStorage.setItem(stateKey, JSON.stringify(legacyState("zebra")));
    localStorage.setItem(legacyKey, JSON.stringify(legacyState("owl")));

    const result = readProjectStateWithMigration(projectRoot);

    expect(result.state.selectedAnimal).toBe("zebra");
    expect(result.migration).toBeNull();
    expect(localStorage.getItem(legacyKey)).toBe(JSON.stringify(legacyState("owl")));
  });

  it("is idempotent after the first migration", () => {
    const [legacyKey] = getLegacyProjectStateKeys(projectRoot);
    localStorage.setItem(legacyKey, JSON.stringify(legacyState()));

    const first = readProjectStateWithMigration(projectRoot);
    const second = readProjectStateWithMigration(projectRoot);

    expect(first.migration).not.toBeNull();
    expect(second.migration).toBeNull();
    expect(second.state).toEqual(first.state);
  });
});

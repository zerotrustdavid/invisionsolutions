/**
 * Fail the build when a dependency ships an install script that has not been
 * reviewed.
 *
 * Install scripts run arbitrary code on any machine that runs `npm install`,
 * before a single line of this project's own code executes. That is the
 * mechanism behind essentially every npm supply-chain compromise, and it fires
 * on developer laptops and CI runners alike.
 *
 * The defence is `npm ci --ignore-scripts`, which this repository uses in CI and
 * which the hosting project sets as its install command. This script is the
 * complement to that: it makes the set of scripts that *would* have run visible
 * and reviewed, so a new one arriving through a transitive upgrade is a build
 * failure rather than a silent change.
 *
 * Each allowlist entry records why it was allowed. An entry without a reason is
 * not an allowlist, it is a rubber stamp.
 *
 * Usage: node scripts/check-install-scripts.mjs
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const HOOKS = ["preinstall", "install", "postinstall"];

/**
 * Reviewed install scripts.
 *
 * `reason` states what the script does and why running it is acceptable.
 * `verified` records how that was established, because reading a script's name
 * is not verification.
 */
const ALLOWED = {
  sharp: {
    reason:
      "Arrives as a dependency of next, which uses it for image optimisation. " +
      "The install script checks whether a system-wide libvips should be used " +
      "and, if so, exits non-zero to trigger a source build. On a normal " +
      "install it is a no-op and the prebuilt platform binary is used instead, " +
      "so skipping it costs nothing.",
    verified:
      "Read node_modules/sharp/install/check.js. It requires ../lib/libvips, " +
      "calls useGlobalLibvips(), and exits 1 only when a global libvips or " +
      "npm_config_build_from_source is present. It writes nothing.",
  },
  "unrs-resolver": {
    reason:
      "Development only. Arrives via eslint-config-next through " +
      "eslint-import-resolver-typescript. The postinstall selects the correct " +
      "platform-specific native binding from the package's own " +
      "optionalDependencies, which npm has already installed.",
    verified:
      "Read node_modules/unrs-resolver/postinstall.js. It is three lines " +
      "calling checkAndPreparePackage from napi-postinstall against its own " +
      "package.json. Lint was confirmed to pass after an install with " +
      "--ignore-scripts, so the binding resolves without it.",
  },
};

function findPackagesWithScripts(root, depth = 0, found = []) {
  if (depth > 4 || !existsSync(root)) return found;

  let entries;
  try {
    entries = readdirSync(root, { withFileTypes: true });
  } catch {
    return found;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === ".bin") continue;
    const dir = join(root, entry.name);

    // Scoped packages (@scope/name) hold their packages one level down.
    if (entry.name.startsWith("@")) {
      findPackagesWithScripts(dir, depth, found);
      continue;
    }

    const manifest = join(dir, "package.json");
    if (existsSync(manifest)) {
      try {
        const pkg = JSON.parse(readFileSync(manifest, "utf8"));
        const scripts = pkg.scripts ?? {};
        const hooks = HOOKS.filter((hook) => scripts[hook]);
        if (hooks.length > 0) {
          found.push({
            name: pkg.name ?? entry.name,
            version: pkg.version ?? "unknown",
            hooks: Object.fromEntries(hooks.map((h) => [h, scripts[h]])),
          });
        }
      } catch {
        // An unreadable manifest is not this script's problem to report.
      }
      findPackagesWithScripts(join(dir, "node_modules"), depth + 1, found);
    }
  }

  return found;
}

const found = findPackagesWithScripts("node_modules");

if (found.length === 0) {
  console.log(
    "check:install-scripts — no dependency install scripts found.\n" +
      "If node_modules is absent, run npm install first; this check needs a " +
      "populated tree to inspect.",
  );
  process.exit(0);
}

const unreviewed = found.filter((pkg) => !ALLOWED[pkg.name]);

console.log(
  `check:install-scripts — ${found.length} package(s) ship install scripts:\n`,
);
for (const pkg of found) {
  const status = ALLOWED[pkg.name] ? "allowed" : "NOT REVIEWED";
  console.log(`  ${pkg.name}@${pkg.version} [${status}]`);
  for (const [hook, cmd] of Object.entries(pkg.hooks)) {
    console.log(`      ${hook}: ${cmd}`);
  }
  if (ALLOWED[pkg.name]) {
    console.log(`      reason: ${ALLOWED[pkg.name].reason}`);
  }
}

// Entries that no longer match anything installed are worth knowing about: a
// stale allowlist quietly widens over time.
const stale = Object.keys(ALLOWED).filter(
  (name) => !found.some((pkg) => pkg.name === name),
);
if (stale.length > 0) {
  console.log(
    `\nNote: allowlist entries no longer present in the tree: ${stale.join(", ")}.` +
      "\nRemove them so the allowlist stays a description of reality.",
  );
}

if (unreviewed.length > 0) {
  console.error(
    `\nFAIL: ${unreviewed.length} install script(s) not on the allowlist:\n` +
      unreviewed.map((p) => `  - ${p.name}@${p.version}`).join("\n") +
      "\n\nRead what each script does, then either add it to ALLOWED in " +
      "scripts/check-install-scripts.mjs with a reason and how you verified it, " +
      "or remove the dependency.\n",
  );
  process.exit(1);
}

console.log("\nPASS: every install script is on the reviewed allowlist.");

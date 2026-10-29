// .github/openspace/import.mjs — the OpenSpace import's steps (see ../workflows/openspace-import.yml).
import { spawn, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEMP = process.env.RUNNER_TEMP || "/tmp";
const STATE = join(TEMP, "openspace-import.json");
const SUMMARY = join(TEMP, "openspace-import-summary.json");
const SOURCE = join(TEMP, "openspace-source");
const REQUEST = ".github/openspace/import.json";

const sh = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (r.status !== 0) process.exit(r.status || 1);
  return r;
};
const out = (cmd, args) => spawnSync(cmd, args, { encoding: "utf8" }).stdout.trim();
const output = (k, v) => process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, k + "=" + v + "\n");
const state = () => JSON.parse(readFileSync(STATE, "utf8"));

/** Tell the Hub how far the import is (best effort: never fails the run). */
async function progress(phase, extra = {}) {
  try {
    const req = state();
    const tokenUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
    if (!req.hub || !req.siteId || !tokenUrl) return;
    const t = await fetch(tokenUrl + "&audience=" + encodeURIComponent(req.hub), {
      headers: { authorization: "bearer " + process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN },
    }).then((r) => r.json());
    await fetch(req.hub + "/ci/sites/" + req.siteId + "/import", {
      method: "POST",
      headers: { authorization: "Bearer " + t.value, "content-type": "application/json" },
      body: JSON.stringify({ id: req.id, phase, ...extra }),
    });
  } catch (e) {
    console.log("(progress report skipped: " + e.message + ")");
  }
}

/**
 * Run the importer, showing its output as usual, and tell the Hub how far it is from the lines
 * it prints (pages read, pages made, pages compared with the old site), at most every 10 s — so
 * the person sees "page 5 of 8" instead of one step that sits still for minutes.
 */
function runWithProgress(cmd, args) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ["inherit", "inherit", "pipe"] });
    const read = new Set();
    const made = [];
    const compared = new Set();
    let round = 1;
    let stage = "reading";
    let last = 0;
    let buf = "";
    const live = () => {
      const pages = Math.max(made.length, read.size);
      if (stage === "reading") return { stage, done: read.size };
      if (stage === "mapping") return { stage, done: made.length, total: Math.max(made.length, read.size) };
      const paths = new Set([...compared].map((k) => k.split("@")[0]));
      return { stage, done: paths.size, total: Math.max(paths.size, made.length || pages), round };
    };
    const report = (force) => {
      const now = Date.now();
      if (!force && now - last < 10000) return;
      last = now;
      void progress("importing", { live: live() });
    };
    const line = (l) => {
      let m;
      if ((m = /^\s+Comparing (\S+) at (\d+)px/.exec(l))) {
        stage = "comparing";
        const k = m[1] + "@" + m[2];
        if (compared.has(k)) {
          round++;
          compared.clear();
        }
        compared.add(k);
      } else if ((m = /^\s+Page (\/\S*)/.exec(l))) {
        stage = "mapping";
        if (!made.includes(m[1])) made.push(m[1]);
      } else if (stage === "reading" && (m = /^\s+(\/\S*)(?: \((\w+)\))?\s*$/.exec(l))) {
        read.add(m[1]);
      } else return;
      report(false);
    };
    child.stderr.on("data", (d) => {
      process.stderr.write(d);
      buf += d.toString("utf8");
      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const l of lines) line(l);
    });
    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

const step = process.argv[2];

if (step === "start") {
  let req = existsSync(REQUEST) ? JSON.parse(readFileSync(REQUEST, "utf8")) : {};
  const cfg = existsSync("openspace.json") ? JSON.parse(readFileSync("openspace.json", "utf8")) : {};
  if (process.env.IN_URL) {
    const opts = (process.env.IN_OPTIONS || "").toLowerCase();
    req = {
      ...req,
      mode: req.mode || "url",
      source: process.env.IN_URL.trim(),
      platform: process.env.IN_PLATFORM || "auto",
      owner: /owner/.test(opts),
      render: /render/.test(opts),
    };
  }
  req.siteId = req.siteId || cfg.siteId;
  req.hub = (req.hub || cfg.hub || "").replace(/\/+$/, "");
  if (!req.source) {
    console.log("Nothing to import: no address in " + REQUEST + " or the run's inputs.");
    process.exit(1);
  }
  writeFileSync(STATE, JSON.stringify(req));
  output("mode", req.mode === "convert" ? "convert" : "url");
  output("render", req.render ? "true" : "false");
  if (req.mode === "convert") {
    // The old site's files, as they were before the conversion branch, for the importer to read.
    mkdirSync(SOURCE, { recursive: true });
    const base = req.base || "HEAD~1";
    const tar = spawnSync("git", ["archive", base], { maxBuffer: 1 << 30 });
    if (tar.status !== 0) process.exit(1);
    sh("tar", ["-x", "-C", SOURCE], { input: tar.stdout, stdio: ["pipe", "inherit", "inherit"] });
    // The old site leaves the branch (its history stays): only the OpenSpace site and the
    // repository's own files remain.
    const keep = new Set(req.keep || []);
    const keepRe = /^(?:\.github\/|docs\/|CNAME$|README|LICEN[CS]E|\.gitignore$|\.gitattributes$)/i;
    const files = out("git", ["ls-files", "-z"]).split("\0").filter(Boolean);
    const gone = files.filter((f) => !keep.has(f) && !keepRe.test(f));
    for (let i = 0; i < gone.length; i += 200) sh("git", ["rm", "-q", "--", ...gone.slice(i, i + 200)]);
  }
  await progress("reading");
}

if (step === "run") {
  const req = state();
  await progress("importing");
  const cli = process.env.OPENSPACE_CLI;
  // The browser always comes along: it measures the live site's fonts and layout, and compares
  // and tunes the result (exactly like an import on a computer).
  const pkgs = ["-p", cli, "-p", process.env.OPENSPACE_SHARP, "-p", process.env.OPENSPACE_PLAYWRIGHT];
  const common = [
    ".",
    "--into-existing",
    "--summary",
    SUMMARY,
    "--tune",
    "3",
    "--compare-thumbs",
    "--compare-out",
    ".openspace/fidelity",
  ];
  const args =
    req.mode === "convert"
      ? ["import", "github", req.source, ...common, "--source-dir", SOURCE]
      : req.platform === "github"
        ? ["import", "github", req.source, ...common]
        : ["import", req.source, ...common, ...(req.platform && req.platform !== "auto" ? ["--platform", req.platform] : [])];
  // --owner (Squarespace's ?format=json) and --render (a browser) only mean something for a
  // website address; a GitHub repository is read from its source.
  const fromGitHub = req.mode === "convert" || req.platform === "github";
  if (req.owner && !fromGitHub) args.push("--owner");
  if (req.render && !fromGitHub) args.push("--render");
  const status = await runWithProgress("npx", ["-y", ...pkgs, "openspace", ...args]);
  const summary = existsSync(SUMMARY) ? JSON.parse(readFileSync(SUMMARY, "utf8")) : undefined;
  await progress("imported", summary ? { counts: summary } : {});
  if (status !== 0) process.exit(status || 1);
}

if (step === "check") {
  await progress("checking");
  sh("npx", ["-y", "-p", process.env.OPENSPACE_CLI, "openspace", "check"]);
}

if (step === "save") {
  const req = state();
  await progress("saving");
  if (existsSync(REQUEST)) sh("git", ["rm", "-q", "--", REQUEST]);
  sh("git", ["config", "user.name", "OpenSpace"]);
  sh("git", ["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
  sh("git", ["add", "-A"]);
  const label = req.mode === "convert" ? "Make this site editable in OpenSpace" : "Move " + req.source + " into OpenSpace";
  sh("git", ["commit", "-q", "-m", label]);
  sh("git", ["push", "-q", "origin", "HEAD"]);
  await progress("saved", { sha: out("git", ["rev-parse", "HEAD"]) });
}

if (step === "publish") {
  sh("gh", ["workflow", "run", "publish.yml", "--ref", "main"]);
  await progress("publishing");
}

if (step === "failed") await progress("failed");

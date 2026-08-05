# -*- coding: utf-8 -*-
"""Publish THE mockup package - one action, everything, cumulative.

    python tools/publish-mockup.py "what changed today"

There is ONE mockup branch (suite-mockup-2026-08-02) and ONE preview site. Every day's
work stacks on the same branch, so "the mockup" always means "the branch as it stands".
This script never picks files by hand - it mirrors the whole working tree - because the
two times the list was hand-written, a file was missed.

It does NOT touch the live site: omerdotan.com is GitHub Pages on `main` of
omerdotan-site. The preview is a different repo with an unlisted URL.
"""
import io, os, re, shutil, subprocess, sys, time, urllib.request

SITE   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRANCH = "suite-mockup-2026-08-02"
PREVIEW_REPO = "https://github.com/dotanomer-hash/suite-preview-09f8f84f24aae370.git"
PREVIEW_URL  = "https://dotanomer-hash.github.io/suite-preview-09f8f84f24aae370"
WORK   = os.path.join(os.environ.get("TEMP", "/tmp"), "oymer-preview-sync")

# the tour HTML files are 50 MB / 22 MB. this repo is public and has a history of
# >100 MB push failures, so anything this size is Omer's explicit call, never a
# side effect of publishing.
MAX_BYTES = 20 * 1024 * 1024


def head_etag(url):
    """The ETag changes on every Pages deploy - the only reliable 'is it live yet'."""
    try:
        rq = urllib.request.Request(url + "?cb=%d" % time.time(), method="HEAD")
        return urllib.request.urlopen(rq, timeout=15).headers.get("ETag")
    except Exception:
        return None


def run(cmd, cwd, quiet=False):
    r = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str),
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode and not quiet:
        sys.exit("FAILED: %s\n%s%s" % (cmd, r.stdout, r.stderr))
    return (r.stdout or "").strip()


def main():
    msg = sys.argv[1] if len(sys.argv) > 1 else "Mockup package update"

    before_etag = head_etag(PREVIEW_URL + "/bimsuite-mockup.html")   # baseline, before we push

    branch = run("git rev-parse --abbrev-ref HEAD", SITE)
    if branch != BRANCH:
        sys.exit("On '%s', expected '%s'. One branch only - do not fork the mockup."
                 % (branch, BRANCH))

    # ---- 1. commit whatever is pending on the mockup branch -------------------
    if run("git status --porcelain", SITE):
        run(["git", "add", "-A"], SITE)
        run(["git", "commit", "-m", msg + "\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>"], SITE)
    run(["git", "push", "-q", "origin", BRANCH], SITE)
    print("branch  : %s @ %s" % (BRANCH, run("git rev-parse --short HEAD", SITE)))

    # ---- 2. mirror the whole tree into the preview clone ---------------------
    # git marks objects read-only; on Windows rmtree then silently leaves them behind
    # and the next clone fails with "destination path already exists".
    if os.path.isdir(WORK):
        def _force(fn, path, exc):
            os.chmod(path, 0o700)
            fn(path)
        shutil.rmtree(WORK, onerror=_force)
    if os.path.isdir(WORK):
        sys.exit("could not clear %s - remove it and re-run" % WORK)
    run(["git", "clone", "-q", "--depth", "1", PREVIEW_REPO, WORK], os.path.dirname(WORK))
    for name, email in [("user.name", run("git config user.name", SITE)),
                        ("user.email", run("git config user.email", SITE))]:
        run(["git", "config", name, email], WORK)      # the fresh clone has no identity

    copied = skipped = 0
    for root, dirs, files in os.walk(SITE):
        dirs[:] = [d for d in dirs if d not in (".git", "node_modules", "tools")]
        for fn in files:
            src = os.path.join(root, fn)
            rel = os.path.relpath(src, SITE).replace("\\", "/")
            if rel.startswith(".") or os.path.getsize(src) > MAX_BYTES:
                skipped += 1
                continue
            dst = os.path.join(WORK, rel)
            d = os.path.dirname(dst)
            if d and not os.path.isdir(d):
                os.makedirs(d)
            shutil.copy2(src, dst)
            copied += 1
    print("mirrored: %d files (%d skipped as too large or hidden)" % (copied, skipped))

    # stage FIRST, then ask what is actually staged. `git status --porcelain` can report
    # line-ending churn that `git add` then normalises away, which made the commit fail
    # with "nothing to commit" and abort the whole publish.
    run(["git", "add", "-A"], WORK)
    if not run("git diff --cached --name-only", WORK):
        print("preview : already current, nothing to push")
        pushed = False
    else:
        run(["git", "commit", "-m", "Preview: " + msg +
             "\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>"], WORK)
        run(["git", "push", "-q", "origin", "HEAD"], WORK)
        print("preview : pushed %s" % run("git rev-parse --short HEAD", WORK))
        pushed = True

    # ---- 3. do not hand over a link until it actually serves this build ------
    # The first version gated on "bimsuite-mockup.css?v=NN" read out of the local HTML.
    # That is a FALSE PASS whenever the number did not change between publishes - the
    # check matched the PREVIOUS deploy and printed "confirmed" instantly. Gate on the
    # ETag instead: it changes on every deploy, whatever we edited.
    if not pushed:
        print("live    : unchanged, nothing was deployed")
    else:
        print("waiting for Pages to redeploy ...")
        for _ in range(36):
            etag = head_etag(PREVIEW_URL + "/bimsuite-mockup.html")
            if etag and etag != before_etag:
                print("live    : confirmed (etag %s -> %s)" % (before_etag, etag))
                break
            time.sleep(10)
        else:
            print("WARNING: Pages did not redeploy in 6 min - the link may be stale")

    # GitHub Pages sends Cache-Control: max-age=600 on HTML, so a browser that saw the
    # page in the last 10 minutes keeps serving the OLD one - and the old one still
    # references the old ?v= stylesheet, so bumping CSS versions cannot reach it. A
    # unique query on the page URL forces a fresh fetch.
    stamp = run("git rev-parse --short HEAD", WORK)
    print("\n" + PREVIEW_URL + "/bimsuite-mockup.html?v=" + stamp)


if __name__ == "__main__":
    main()

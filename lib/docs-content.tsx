import type { ReactNode } from "react";
import Link from "next/link";
import { Callout } from "@/components/docs/Prose";

export interface DocEntry {
  title: string;
  description: string;
  section: string;
  body: ReactNode;
}

export const docs: Record<string, DocEntry> = {
  "": {
    title: "What is Fabrica?",
    description:
      "A 60-second pitch: who Fabrica is for and when to reach for it.",
    section: "Getting Started",
    body: (
      <>
        <p>
          Fabrica is a desktop Agentic Development Environment (ADE) for running
          multiple AI coding agents side by side. Every task gets its own git
          worktree, its own agent terminal, and its own browser tab — so you can
          fan out work across Claude Code, Codex, Cursor CLI, and friends without
          stashing, branch-juggling, or losing flow.
        </p>

        <h2>When to use Fabrica</h2>
        <ul>
          <li>
            You want three agents trying the same bug in parallel and to pick the
            winner.
          </li>
          <li>You want to review AI-generated diffs seriously before you ship them.</li>
          <li>
            You already pay for Claude Code, Codex, or Cursor CLI and want one
            place to orchestrate them.
          </li>
          <li>
            You want agents to run remotely — over SSH, on a self-hosted Fabrica
            server, or in an on-demand VM — without giving up your IDE.
          </li>
        </ul>

        <h2>Who it&apos;s for</h2>
        <p>
          Fabrica is designed for people who already write code for a living and
          want to use AI as leverage — not as a replacement. It assumes you read
          diffs, care about commits, and keep a worktree tidy. If you&apos;re looking
          for a no-code tool, Fabrica is not that.
        </p>

        <h2>What Fabrica is not</h2>
        <ul>
          <li>
            <strong>Not a model.</strong> Fabrica runs agents you already use —
            bring your own Claude, Codex, or OpenCode subscription.
          </li>
          <li>
            <strong>Not a git replacement.</strong> Every worktree is a real git
            worktree. You can <code>cd</code> in and use plain git whenever you
            want.
          </li>
          <li>
            <strong>Not a hosted VPS product.</strong> Fabrica runs on your
            desktop by default. Remote compute uses machines and cloud accounts
            you control — SSH targets, self-hosted Fabrica servers, or cloud VMs.
          </li>
        </ul>

        <Callout type="tip" title="Next steps">
          <p>
            Head to <Link href="/docs/install">Install</Link>, then walk through{" "}
            <Link href="/docs/first-session">Your first crew session</Link> — the
            single most important page in these docs. When you&apos;re ready to move
            agents off the laptop, start with{" "}
            <Link href="/docs/ways-to-run">Ways to run Fabrica</Link>.
          </p>
        </Callout>
      </>
    ),
  },

  install: {
    title: "Install",
    description:
      "Get Fabrica running on macOS, Windows, Linux, and your phone.",
    section: "Getting Started",
    body: (
      <>
        <p>
          Fabrica ships as a native desktop app for macOS, Windows, and Linux,
          plus a mobile companion for iOS and Android. The desktop app is the
          control center; the mobile app lets you watch and steer agents from
          anywhere.
        </p>

        <h2>Desktop — macOS, Windows, Linux</h2>
        <ul>
          <li>
            <strong>macOS:</strong> Download the Apple Silicon or Intel
            <code>.dmg</code>, drag Fabrica to Applications, and launch it.
          </li>
          <li>
            <strong>Windows:</strong> Run the <code>.exe</code> installer and
            follow the prompts.
          </li>
          <li>
            <strong>Linux:</strong> Use the <code>.AppImage</code> (mark it
            executable) or the <code>.deb</code> package.
          </li>
        </ul>

        <Callout type="info" title="Via a package manager">
          <p>
            macOS (Homebrew): <code>brew install --cask fabrica</code>. Arch
            Linux (AUR): <code>yay -S fabrica-bin</code>.
          </p>
        </Callout>

        <h2>Mobile companion — iOS, Android</h2>
        <p>
          Pair the companion app with your desktop to monitor and steer agents
          from your phone.
        </p>
        <ul>
          <li>
            <strong>iOS:</strong> Download on the App Store, or join the public
            TestFlight.
          </li>
          <li>
            <strong>Android:</strong> Sideload the latest APK from the releases
            page.
          </li>
        </ul>

        <h2>Running a headless server</h2>
        <p>
          Want to run <code>fabrica serve</code> on a headless Linux box? See the
          server guide, then jump to{" "}
          <Link href="/docs/ways-to-run">Ways to run Fabrica</Link>.
        </p>

        <Callout type="warn" title="Before you start">
          <p>
            Fabrica orchestrates agents you already subscribe to. Make sure you
            have at least one CLI agent (Claude Code, Codex, or OpenCode)
            installed and authenticated before your first session.
          </p>
        </Callout>
      </>
    ),
  },

  "first-session": {
    title: "Your first crew session",
    description:
      "Fan one prompt across three agents and merge the winner.",
    section: "Getting Started",
    body: (
      <>
        <p>
          The fastest way to feel Fabrica is to run the same task in three
          isolated worktrees at once, then compare the diffs and merge the best
          one. Here&apos;s the whole flow in under five minutes.
        </p>

        <h2>1. Open a repo</h2>
        <p>
          Launch Fabrica and open the repository you want to work in. Fabrica
          reads the existing git state — no migration, no config required.
        </p>

        <h2>2. Spin up a crew</h2>
        <p>
          From the command bar, create three worktrees pointed at the same base
          branch. Assign each one the same task, e.g.{" "}
           <em>&quot;Add input validation to the login form.&quot;</em>
        </p>
        <pre>
          <code>{`fabrica worktree create --name try-a --task "login validation"
fabrica worktree create --name try-b --task "login validation"
fabrica worktree create --name try-c --task "login validation"`}</code>
        </pre>

        <h2>3. Let them run</h2>
        <p>
          Each worktree gets its own agent terminal. Watch them stream in
          parallel. Because they&apos;re isolated, none of them can clobber your
          <code>main</code> branch.
        </p>

        <h2>4. Compare and merge</h2>
        <p>
          Use the diff viewer to line up the three results. Pick the cleanest
          diff, merge it into your branch, and close the other worktrees.
        </p>

        <Callout type="tip" title="Pro move">
          <p>
            Keep the three attempts around until you&apos;ve merged. You can cherry-pick
            the best lines from each before deleting the losers.
          </p>
        </Callout>
      </>
    ),
  },

  "ways-to-run": {
    title: "Ways to run Fabrica",
    description:
      "Local desktop, SSH, self-hosted server, or on-demand cloud VMs.",
    section: "Getting Started",
    body: (
      <>
        <p>
          Fabrica runs on your desktop by default, but your agents don&apos;t have to.
          Move compute anywhere you control without losing the IDE.
        </p>

        <h2>Local (default)</h2>
        <p>
          Everything runs on your machine. Worktrees are real git worktrees on
          local disk, terminals are native, and nothing leaves your laptop unless
          you approve it.
        </p>

        <h2>SSH worktrees</h2>
        <p>
          Point a worktree at a remote box over SSH. You get full file editing,
          git, and terminals on a beefy remote machine — with auto-reconnect and
          port forwarding handled for you.
        </p>

        <h2>Self-hosted Fabrica server</h2>
        <p>
          Run a Fabrica server inside your own infrastructure and connect your
          desktop to it. Agents execute on your hardware, under your network
          policy.
        </p>

        <h2>On-demand cloud VMs</h2>
        <p>
          Spin up a per-workspace cloud environment for heavy parallel sweeps,
          then tear it down when the work is done. Great for 24/7 background
          daemons that shouldn&apos;t tie up your laptop.
        </p>

        <Callout type="info" title="Bring your own keys">
          <p>
            On every target, your API keys, SSH credentials, and OAuth tokens
            stay encrypted locally. They&apos;re only decrypted in memory during
            isolated task execution — never egressed to a third party.
          </p>
        </Callout>
      </>
    ),
  },

  worktrees: {
    title: "Parallel worktrees",
    description:
      "Fan one prompt across many agents, each in its own isolated git worktree.",
    section: "Core Concepts",
    body: (
      <>
        <p>
          A worktree is a git worktree — a second working directory attached to
          the same repository. Fabrica gives every task its own worktree so
          agents never fight over the same files.
        </p>

        <h2>Why worktrees</h2>
        <ul>
          <li>
            <strong>Zero collisions.</strong> Five agents on five branches, one
            pristine <code>main</code>.
          </li>
          <li>
            <strong>Easy comparison.</strong> Diff two attempts side by side and
            keep the winner.
          </li>
          <li>
            <strong>Reproducible.</strong> Reproduce or roll back any result
            instantly by checking out the worktree.
          </li>
        </ul>

        <h2>Creating a worktree</h2>
        <pre>
          <code>{`fabrica worktree create --name feature/auth --base main
fabrica worktree create --name exp/redesign --agent claude`}</code>
        </pre>

        <h2>Lifecycle</h2>
        <p>
          A worktree is a real git checkout. You can <code>cd</code> in and run
          plain git commands at any time — Fabrica never hides the underlying
          repo from you. When you&apos;re done, merge the branch and delete the
          worktree.
        </p>

        <Callout type="tip" title="Disk sandboxes too">
          <p>
            Not every job needs a git branch. For throwaway research or
            scratchpad work, run agents in a plain disk folder instead of a
            worktree.
          </p>
        </Callout>
      </>
    ),
  },

  terminal: {
    title: "Terminal splits",
    description:
      "Ghostty-class terminals with WebGL rendering, infinite splits, and scrollback.",
    section: "Core Concepts",
    body: (
      <>
        <p>
          Every agent runs in its own terminal. Fabrica&apos;s terminal is
          Ghostty-class: GPU-rendered, fast, and built for splits.
        </p>

        <h2>Split anything</h2>
        <p>
          Arrange agents, terminals, browsers, diffs, and files into split panes
          that match the shape of the task. Stack them, tile them, or pop one out
          full-screen.
        </p>

        <h2>Scrollback that survives restarts</h2>
        <p>
          Terminal history is persisted, so closing and reopening a worktree
          brings back the full log. No more lost context after a crash or a
          reboot.
        </p>

        <h2>Quick open</h2>
        <p>
          Search across worktrees, files, agents, commands, and repo context
          without leaving your flow. Bind it to a hotkey and it becomes muscle
          memory.
        </p>
      </>
    ),
  },

  "browser/design-mode": {
    title: "Design Mode",
    description:
      "Click any UI element in a real browser and ship its context to your agent.",
    section: "Core Concepts",
    body: (
      <>
        <p>
          Design Mode turns the embedded browser into a direct line to your
          agents. Click an element and Fabrica captures exactly what the agent
          needs.
        </p>

        <h2>What gets captured</h2>
        <ul>
          <li>The element&apos;s HTML and computed CSS.</li>
          <li>A cropped screenshot of the element in context.</li>
          <li>The surrounding DOM path so the agent can locate it again.</li>
        </ul>

        <h2>Why it matters</h2>
        <p>
          Instead of describing a bug in prose (&quot;the button is off by a few
          pixels&quot;), you point. The agent receives precise, actionable context
          and ships a tighter diff on the first try.
        </p>

        <Callout type="info" title="Pair with Computer Use">
          <p>
            Need real UI interaction — not just inspection? See{" "}
            <Link href="/docs/cli/computer-use">Computer Use</Link> for letting agents
            operate desktop apps through the accessibility tree.
          </p>
        </Callout>
      </>
    ),
  },

  "review/annotate-diff": {
    title: "Annotate AI diffs",
    description:
      "Drop comments on any diff line and ship them back to the agent.",
    section: "Core Concepts",
    body: (
      <>
        <p>
          Review is a first-class workflow in Fabrica. You don&apos;t approve blind —
          you read the diff, leave notes, and send them straight back to the
          agent.
        </p>

        <h2>Comment on any line</h2>
        <p>
          Open a worktree&apos;s diff and drop an inline comment anywhere. Ask for a
          rename, flag a regression, or suggest a cleaner approach.
        </p>

        <h2>Send it back</h2>
        <p>
          Each comment thread can be dispatched back to the originating agent.
          The agent sees your note in its own context and revises the worktree —
          no copy-paste, no re-prompting.
        </p>

        <Callout type="tip" title="Review, edit, commit">
          <p>
            You can also edit the diff directly and commit from the IDE. Fabrica
            treats your review as the gate before anything touches{" "}
            <code>main</code>.
          </p>
        </Callout>
      </>
    ),
  },

  "agents/usage": {
    title: "Account switcher & usage",
    description:
      "See per-agent usage, rate-limit resets, and hot-swap accounts.",
    section: "Agents & Accounts",
    body: (
      <>
        <p>
          When you bring your own agents, you bring your own accounts. Fabrica
          shows exactly what each one is spending and when limits reset.
        </p>

        <h2>Usage tracking</h2>
        <ul>
          <li>Per-agent token and request usage for the current period.</li>
          <li>Rate-limit reset timers so you know when a model frees up.</li>
          <li>Historical spend per worktree and per project.</li>
        </ul>

        <h2>Hot-swap accounts</h2>
        <p>
          Running low on one Codex account? Add a second and switch without
          re-logging in. Fabrica keeps credentials encrypted locally and only
          injects them during isolated execution.
        </p>

        <Callout type="warn" title="Keys never leave your machine">
          <p>
            All API keys, SSH credentials, and OAuth tokens are stored in your OS
            keychain with AES-256 GCM. They are never uploaded to a Fabrica
            server.
          </p>
        </Callout>
      </>
    ),
  },

  mobile: {
    title: "Mobile companion",
    description: "Monitor and steer your agents from your phone.",
    section: "Agents & Accounts",
    body: (
      <>
        <p>
          The Fabrica mobile companion pairs with your desktop over an
          end-to-end encrypted tunnel. Your agents keep working; you keep
          oversight from anywhere.
        </p>

        <h2>What you can do on the go</h2>
        <ul>
          <li>Watch live agent status and terminal feeds.</li>
          <li>Get push notifications when an agent finishes or needs a gate.</li>
          <li>Approve 1-tap payment and deployment gates.</li>
          <li>Hot-swap accounts and check usage.</li>
        </ul>

        <h2>Approval gates on the phone</h2>
        <p>
          High-stakes milestones — payments, production deploys, public
          campaigns — pause for your explicit 1-click authorization. Act on them
          from the lock screen instead of racing back to your desk.
        </p>

        <Callout type="tip" title="Killswitch in your pocket">
          <p>
            The mobile app includes the same killswitch as the desktop. Kill a
            runaway daemon from anywhere.
          </p>
        </Callout>
      </>
    ),
  },

  "cli/overview": {
    title: "Fabrica CLI",
    description: "Script every workflow with the Fabrica command line.",
    section: "CLI & Automation",
    body: (
      <>
        <p>
          Agents drive Fabrica, but so can you. The <code>fabrica</code> CLI
          exposes the same operations the UI uses — perfect for automation and
          CI.
        </p>

        <h2>Core commands</h2>
        <pre>
          <code>{`fabrica worktree create --name feat-x --base main
fabrica worktree list
fabrica snapshot --worktree feat-x
fabrica click  "Submit"
fabrica fill  "email" "you@foundry.dev"`}</code>
        </pre>

        <h2>What you can automate</h2>
        <ul>
          <li>Create and tear down worktrees.</li>
          <li>Take and restore snapshots of a worktree&apos;s state.</li>
          <li>Operate the embedded browser with <code>click</code> and <code>fill</code>.</li>
          <li>Chain commands into scripts for repeatable crew routines.</li>
        </ul>

        <Callout type="info" title="See also">
          <p>
            For driving real desktop UI, combine the CLI with{" "}
            <Link href="/docs/cli/computer-use">Computer Use</Link>.
          </p>
        </Callout>
      </>
    ),
  },

  "cli/computer-use": {
    title: "Computer Use",
    description: "Let agents operate desktop apps through the accessibility tree.",
    section: "CLI & Automation",
    body: (
      <>
        <p>
          Sometimes an agent needs to use an app the way a human would — click
          buttons, type into fields, read visible UI. Computer Use gives agents a
          safe, observable window into your desktop.
        </p>

        <h2>How it works</h2>
        <p>
          Fabrica reads the accessibility tree of a target window, sends it to
          the agent, and executes the agent&apos;s chosen actions (click, type,
          scroll). Every step is logged so you can audit what happened.
        </p>

        <h2>When to use it</h2>
        <ul>
          <li>Operating a desktop app that has no API or CLI.</li>
          <li>Driving a native installer or legacy tool.</li>
          <li>Reproducing a bug through real UI interaction.</li>
        </ul>

        <Callout type="warn" title="Human-in-the-loop">
          <p>
            Computer Use respects your approval gates. Sensitive actions can be
            set to require a 1-tap confirmation before they execute.
          </p>
        </Callout>
      </>
    ),
  },

  faq: {
    title: "FAQ",
    description: "Common questions about Fabrica, worktrees, and the product.",
    section: "Reference",
    body: (
      <>
        <h2>What is Fabrica?</h2>
        <p>
          Fabrica is a desktop Agentic Development Environment for running
          multiple AI coding agents side by side, each in its own isolated git
          worktree.
        </p>

        <h2>What is an ADE, and how is it different from an IDE?</h2>
        <p>
          An IDE is built for you. An ADE is built for you <em>and</em> your
          agents — worktrees, terminals, a browser, and a CLI in one app, all
          engineered around parallel agent execution.
        </p>

        <h2>How does Fabrica use git worktrees?</h2>
        <p>
          Every task runs on its own git worktree linked to your repo. Your
          working branch stays pristine — no stashing, no merge conflicts, no
          cross-task pollution.
        </p>

        <h2>Does Fabrica work with Claude Code?</h2>
        <p>
          Yes. Fabrica works with any CLI agent — Claude Code, Codex, OpenCode,
          Grok, and more. You bring your own subscription; Fabrica orchestrates
          it.
        </p>

        <h2>What terminal does Fabrica use?</h2>
        <p>
          A Ghostty-class, GPU-rendered terminal with WebGL, infinite splits, and
          persistent scrollback.
        </p>

        <h2>How often does Fabrica ship?</h2>
        <p>
          Frequently. The changelog is the real feature list — new capabilities
          land continuously.
        </p>

        <h2>Is Fabrica free?</h2>
        <p>
          The desktop app is free and open source (MIT). You bring your own agent
          subscriptions; Fabrica itself is the orchestration layer.
        </p>

        <h2>Is Fabrica a Cursor alternative?</h2>
        <p>
          Not exactly. Cursor puts one agent inside your editor. Fabrica runs a
          whole crew of agents across isolated worktrees and gives you the
          command center to direct them.
        </p>
      </>
    ),
  },
};

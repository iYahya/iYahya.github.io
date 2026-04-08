import { Portfolio } from "@/components/Portfolio";
import type { ContributedRepo } from "@/lib/types";
import { getMessages } from "@/lib/messages";

// When the GitHub section is on again, restore:
// import { githubUsernameFromMessages, loadContributedRepos } from "@/lib/github-repos";

export default async function ArabicHome() {
  const messages = getMessages("ar");

  /**
   * GitHub repositories section: OFF for now (no “GitHub” nav item, no build-time API call).
   * To turn it back on: import `loadContributedRepos` and `githubUsernameFromMessages`, then use:
   *   const username = process.env.GITHUB_USERNAME || githubUsernameFromMessages(messages);
   *   const contributedRepos = await loadContributedRepos(username, messages.contributed.extra);
   */
  const contributedRepos: ContributedRepo[] = [];

  return <Portfolio locale="ar" messages={messages} contributedRepos={contributedRepos} />;
}

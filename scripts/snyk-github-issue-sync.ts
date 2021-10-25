/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import syncJsonOutput from '../snyk.json';

type Vulnerability = {
  description: string;
  id: string;
  packages: Set<string>;
};

const fetchSnykGithubIssueMap = (): Record<string, string> => {
  const snykGithubIssueMap: Record<string, string> = {};

  // TODO(hhogg): Fetch all github issues that have the Snyk label,
  // and reference the github issue via the snyk id.

  return snykGithubIssueMap;
};

const createGithubIssue = (vulnerability: Vulnerability) => {
  console.log(
    `Create issue for vulnerability ${
      vulnerability.id
    } affecting packages ${Array.from(vulnerability.packages)}`,
  );
  // TODO(hhogg): Create github issue with the contents from a Snyk issue.
};

const updateGithubIssue = (
  githubIssueId: string,
  vulnerability: Vulnerability,
) => {
  console.log(
    `Update issue ${githubIssueId} for vulnerability ${vulnerability.id}`,
  );
  // TODO(hhogg): Update github issue with the contents from a Snyk issue.
};

const closeGithubIssue = (githubIssueId: string) => {
  console.log(`Delete issue ${githubIssueId}`);
  // TODO(hhogg): Delete a github issue
};

(async () => {
  const snykGithubIssueMap = fetchSnykGithubIssueMap();
  const vulnerabilityStore: Record<string, Vulnerability> = {};

  // Group the Snyk vulnerabilities, and aggregate the affecting packages.
  syncJsonOutput.forEach(({ projectName, vulnerabilities }) => {
    vulnerabilities.forEach(
      ({ id, description }: { id: string; description: string }) => {
        if (id !== undefined && description !== undefined) {
          if (vulnerabilityStore[id]) {
            vulnerabilityStore[id].packages.add(projectName);
          } else {
            vulnerabilityStore[id] = {
              description,
              id,
              packages: new Set([projectName]),
            };
          }
        }
      },
    );
  });

  // Loop over the grouped vulnerabilities and create/update accordingly
  Object.entries(vulnerabilityStore).forEach(([id, vulnerability]) => {
    if (snykGithubIssueMap[id]) {
      updateGithubIssue(snykGithubIssueMap[id], vulnerability);
    } else {
      createGithubIssue(vulnerability);
    }
  });

  // Loop over the Github issues and delete accordingly.
  Object.entries(snykGithubIssueMap).forEach(([githubIssueId, snykId]) => {
    if (!snykGithubIssueMap[snykId]) {
      closeGithubIssue(githubIssueId);
    }
  });
})();

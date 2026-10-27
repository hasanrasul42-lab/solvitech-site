/**
 * Chapter 03 -- Selected Work.
 *
 * Real projects only. The chapter (and its navigation link) stays hidden until
 * at least one project here is marked `approved: true` by the founder, so the
 * homepage never shows empty, sample or invented case studies.
 *
 * Add a project only with the client's permission and with outcomes that can
 * be stated factually.
 */

export interface WorkProject {
  id: string;
  /** Client or project name, as the client has agreed it may be shown. */
  client: string;
  title: string;
  /** e.g. "Custom software", "Automation", "Integration". */
  capability: string;
  /** What the business needed, in plain language. */
  challenge: string;
  /** What was built or changed. */
  solution: string;
  /** Factual, client-approved result. Omit rather than estimate. */
  outcome?: string;
  /** Future case-study page, e.g. "/work/project-slug". */
  page?: string;
  /** Only approved projects are ever rendered. */
  approved: boolean;
}

export const WORK_INTRO = {
  eyebrow: "Selected work",
  title: "Recent projects",
  intro: "A selection of systems, automations and platforms we have engineered for clients.",
};

export const WORK_PROJECTS: WorkProject[] = [];

export const APPROVED_WORK = WORK_PROJECTS.filter((p) => p.approved);
export const WORK_VISIBLE = APPROVED_WORK.length > 0;

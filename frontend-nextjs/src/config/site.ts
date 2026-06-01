const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "Joy Trips";

const projectNameCompact = projectName.replace(/\s+/g, "");
const projectNameLower = projectName.toLowerCase();

export const siteConfig = {
  projectName,
  projectNameCompact,
  projectNameLower,
};

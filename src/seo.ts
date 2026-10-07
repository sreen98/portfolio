import { education, profile, skillGroups } from "./data/resume";

/** Public URL of the site, from VITE_SITE_URL in .env. */
export const SITE_URL: string = import.meta.env.VITE_SITE_URL;

/**
 * schema.org structured data for the page: a ProfilePage about a Person.
 * Search engines use it for knowledge panels and rich results.
 */
export function structuredData() {
  const skills = skillGroups.flatMap((group) => group.items);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE_URL}/`,
    name: `${profile.name} | Frontend Engineer`,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
      jobTitle: profile.role,
      description: profile.summary,
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/img/sreenath-at-work.webp`,
      email: `mailto:${profile.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ernakulam",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
      knowsAbout: skills,
      sameAs: [profile.linkedin, profile.github, profile.instagram, profile.medium],
    },
  };
}

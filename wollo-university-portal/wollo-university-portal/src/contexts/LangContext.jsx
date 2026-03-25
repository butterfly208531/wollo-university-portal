import React, { createContext, useContext } from 'react';

// All UI strings in English — Google Translate handles visual translation
const strings = {
  nav: {
    home: 'Home', policies: 'Academic Policies', about: 'About',
    search: 'Search', login: 'Admin Login', logout: 'Logout',
    dashboard: 'Dashboard', language: 'Language', theme: 'Theme', accessibility: 'Accessibility',
  },
  hero: {
    title: 'Wollo University Academic Portal',
    subtitle: 'Your comprehensive guide to academic policies, regulations, and student information',
    searchPlaceholder: 'Search policies, regulations...',
    browseAll: 'Browse All Policies', learnMore: 'Learn More',
  },
  categories: {
    title: 'Policy Categories', all: 'All Categories',
    admission: 'Student Admission', registration: 'Registration',
    academic: 'Academic Rules', grading: 'Grading System',
    graduation: 'Graduation', conduct: 'Student Conduct',
    fees: 'Tuition & Fees', transfer: 'Transfer Policies',
  },
  policies: {
    title: 'Academic Policies', noResults: 'No policies found',
    readMore: 'Read More', lastUpdated: 'Last Updated',
    version: 'Version', category: 'Category', filter: 'Filter',
    sortBy: 'Sort By', newest: 'Newest First', oldest: 'Oldest First', az: 'A-Z', za: 'Z-A',
  },
  search: {
    title: 'Search Results', placeholder: 'Search academic policies...',
    cta: 'Need Help Finding Information?', voiceSearch: 'Voice Search',
    results: 'results found', noResults: 'No results found for',
    suggestions: 'Suggestions', filters: 'Filters', clearFilters: 'Clear Filters', searching: 'Searching...',
  },
  about: {
    title: 'About Wollo University', mission: '1.1.1 Mission', vision: 'Vision',
    values: '1.1.2 Values', motto: 'Motto',
    missionHeading: 'University has the following missions to accomplish',
    missionText: 'To serve as a model for other educational institutions within the country by producing internationally competent graduates.',
    visionText: 'To be a center of excellence in education, research, and community engagement in Ethiopia and Africa by 2030.',
    mottoText: '"Knowledge for Development"',
    valuesText: 'Innovation, Professionalism, Team Spirit, Emphasis to Quality, Continual Learning, Partnership, Academic Freedom and Autonomy, Social Responsibility',
    universityFacts: 'About Wollo University',
    universityDesc1: 'Wollo University is a public university located in Dessie, Amhara Region, Ethiopia. Established in 2007.',
    universityDesc2: 'The university is committed to providing quality education, conducting relevant research, and engaging with the community.',
    established: 'Established', location: 'Location', programs: 'Programs',
    students: 'Students', faculties: 'Faculties', campuses: 'Campuses',
    values_list: [
      'Innovation: Accommodates new ideas with open mind.',
      'Professionalism: Operates with the highest standards.',
      'Team spirit: Staff, students and community work together.',
      'Emphasis to Quality: Believes in excellence in all activities.',
      'Continual learning: Learns from both successes and failures.',
      'Partnership: Success depends on partners success.',
      'Academic Freedom and Autonomy: Uses academic freedom to improve services.',
      'Social Responsibility: Commits compassion and concern for others.',
    ],
  },
  admin: {
    login: 'Admin Login', email: 'Email Address', password: 'Password',
    signIn: 'Sign In', forgotPassword: 'Forgot Password?', dashboard: 'Dashboard',
    totalPolicies: 'Total Policies', totalCategories: 'Total Categories',
    recentActivity: 'Recent Activity', manageAdmins: 'Manage Admins',
    systemSettings: 'System Settings', auditLogs: 'Audit Logs',
    createPolicy: 'Create Policy', editPolicy: 'Edit Policy', deletePolicy: 'Delete Policy',
    importPolicies: 'Import Policies', versionHistory: 'Version History',
    restore: 'Restore', save: 'Save', cancel: 'Cancel', delete: 'Delete', confirm: 'Confirm',
    titleEn: 'Title', contentEn: 'Content', selectCategory: 'Select Category',
    tags: 'Tags', publish: 'Publish', draft: 'Save as Draft',
  },
  accessibility: {
    title: 'Accessibility Settings', fontSize: 'Font Size', highContrast: 'High Contrast',
    grayscale: 'Grayscale', dyslexiaFont: 'Dyslexia-Friendly Font',
    lineHeight: 'Line Height', letterSpacing: 'Letter Spacing',
    pauseAnimations: 'Pause Animations', highlightLinks: 'Highlight Links', reset: 'Reset All',
  },
  common: {
    loading: 'Loading...', error: 'An error occurred', retry: 'Retry',
    back: 'Back', next: 'Next', previous: 'Previous', close: 'Close', open: 'Open',
    yes: 'Yes', no: 'No', required: 'Required', optional: 'Optional',
    skipToContent: 'Skip to main content', pageNotFound: 'Page Not Found', goHome: 'Go to Home',
  },
  footer: {
    rights: 'All rights reserved', privacy: 'Privacy Policy', terms: 'Terms of Use',
    contact: 'Contact Us', address: 'Dessie, Amhara Region, Ethiopia',
    phone: '+251 33 111 2345', email: 'info@wu.edu.et',
    quickLinks: 'Quick Links', legal: 'Legal',
  },
};

function resolve(obj, key) {
  return key.split('.').reduce((cur, p) => (cur == null ? key : cur[p]), obj) ?? key;
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const t = (key, opts) => {
    const val = resolve(strings, key);
    if (opts?.returnObjects) return val;
    if (typeof val === 'string') return val;
    return key;
  };

  return (
    <LangContext.Provider value={{ lang: 'en', t, i18n: { language: 'en' } }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() { return useContext(LangContext); }
export function useTranslation() { return useLang(); }

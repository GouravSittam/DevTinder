// For Development
// export const BASE_URL = "http://localhost:5000";

// For Production
// export const BASE_URL = "/api"

// Takes dynamic hostname
// export const BASE_URL = location.hostname === "localhost" ? "http://localhost:5000": "/api";
// export const BASE_URL = location.hostname === "20.40.54.228" ? "http://20.40.54.228:5000": "/api";

// export const BASE_URL =
//   location.hostname === "devconnects.tech" ||
//   location.hostname === "www.devconnects.tech" ||
//   location.hostname === "localhost" ||
//   location.hostname === "20.40.54.228"
//     ? "http://20.40.54.228:5000"
//     : "/api";

// export const BASE_URL = (() => {
//   const hostname = window.location.hostname;
//   const AZURE_API = 'http://20.40.54.228:5000';
//   const RENDER_API = 'https://devconnect-ttjp.onrender.com';

//   // Development or Production check
//   if (hostname === 'localhost') {
//     return 'http://localhost:5000';
//   }

//   // For both domain and direct IP access
//   if (hostname === 'devconnects.tech' || 
//       hostname === 'www.devconnects.tech' || 
//       hostname === '20.40.54.228') {
//     return AZURE_API;
//   }

//    if (hostname === 'devconnect-ttjp.onrender.com') {
//     return RENDER_API;
//    }

//   return '/api'; // Fallback
// })();

export const BASE_URL = (() => {
  const hostname = window.location.hostname;
  const RENDER_API = 'https://devconnect-ttjp.onrender.com/api';
  const AZURE_API = 'http://20.244.50.103/api';
  const DEVCONNECTS_API = 'https://devconnects.tech/api';

  // Development or Production check
  if (hostname === 'localhost') {
    return 'http://localhost:5000';
  }

  // For both domain and direct IP access
  if (
    hostname === 'devconnects.tech' ||
    hostname === 'www.devconnects.tech'
  ) {
    return DEVCONNECTS_API;
  }

  if (hostname === 'devconnect-ttjp.onrender.com') {
    return RENDER_API;
  }

  // For new API IP
  if (hostname === '20.244.50.103') {
    return AZURE_API;
  }

  return '/api'; // Fallback
  })();

  export const techSkillsOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "React", label: "React" },
  { value: "Node.js", label: "Node.js" },
  { value: "Python", label: "Python" },
  { value: "Django", label: "Django" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Express", label: "Express" },
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "Java", label: "Java" },
  { value: "C++", label: "C++" },
  { value: "AWS", label: "AWS" },
  { value: "Docker", label: "Docker" },
  // Add more as needed
];

/**
 * Calculates Jaccard similarity between two arrays (e.g., skills).
 * Returns a value between 0 and 1.
 */
export function jaccardSimilarity(arrA, arrB) {
  if (!arrA || !arrB || arrA.length === 0 && arrB.length === 0) return 0;
  const setA = new Set(arrA);
  const setB = new Set(arrB);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}
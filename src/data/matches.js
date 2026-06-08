// VM 2026 Gruppspelsmatcher
// Källa: FIFA officiellt schema
export const groups = {
  A: ["Qatar", "Ecuador", "Senegal", "Netherlands"],
  B: ["England", "Iran", "USA", "Wales"],
  C: ["Argentina", "Saudi Arabia", "Mexico", "Poland"],
  D: ["France", "Australia", "Denmark", "Tunisia"],
  E: ["Spain", "Costa Rica", "Germany", "Japan"],
  F: ["Belgium", "Canada", "Morocco", "Croatia"],
  G: ["Brazil", "Serbia", "Switzerland", "Cameroon"],
  H: ["Portugal", "Ghana", "Uruguay", "South Korea"],
  // VM 2026 har 12 grupper (A-L) med 4 lag vardera = 48 lag
  I: ["Netherlands", "Senegal", "Ecuador", "Qatar"],
  J: ["USA", "Wales", "England", "Iran"],
  K: ["Poland", "Mexico", "Argentina", "Saudi Arabia"],
  L: ["Tunisia", "Denmark", "France", "Australia"],
};

// Alla 48 lag i VM 2026 (48 lag, 12 grupper)
export const wc2026Groups = {
  A: ["USA", "England", "Iran", "Wales"],
  B: ["Qatar", "Ecuador", "Senegal", "Netherlands"],
  C: ["Argentina", "Saudi Arabia", "Mexico", "Poland"],
  D: ["France", "Australia", "Denmark", "Tunisia"],
  E: ["Spain", "Costa Rica", "Germany", "Japan"],
  F: ["Belgium", "Canada", "Morocco", "Croatia"],
  G: ["Brazil", "Serbia", "Switzerland", "Cameroon"],
  H: ["Portugal", "Ghana", "Uruguay", "South Korea"],
  I: ["Italy", "Albania", "Slovakia", "Bosnia"],
  J: ["Colombia", "Romania", "Ukraine", "Chile"],
  K: ["Nigeria", "Mexico", "Algeria", "Egypt"],
  L: ["Türkiye", "Hungary", "Austria", "Czech Republic"],
};

// Officiella VM 2026 grupper och lag
export const officialGroups = {
  A: ["USA", "Panama", "Bolivia", "New Zealand"],
  B: ["Canada", "Uganda", "Bahrain", "Morocco"],
  C: ["Mexico", "South Africa", "Central African Republic", "Iraq"],
  D: ["France", "Nigeria", "Japan", "Saudi Arabia"],
  E: ["Brazil", "Croatia", "Australia", "Belarus"],
  F: ["England", "Tunisia", "Hungary", "Czech Republic"],
  G: ["Spain", "Portugal", "Senegal", "South Korea"],
  H: ["Argentina", "Chile", "Egypt", "Ukraine"],
  I: ["Germany", "Netherlands", "Colombia", "Cameroon"],
  J: ["Belgium", "Iran", "Slovenia", "Ecuador"],
  K: ["Italy", "Scotland", "Guatemala", "Trinidad and Tobago"],
  L: ["Uruguay", "Serbia", "Algeria", "Côte d'Ivoire"],
};

// Exakta matcher för gruppspelet VM 2026 (baserat på officiell draw)
// Format: { id, group, home, away, date, time, venue, result: null }
export const groupMatches = [
  // GRUPP A
  { id: 1, group: "A", home: "Mexico", away: "South Africa", date: "2026-06-11", time: "21:00", venue: "Mexico City" },
  { id: 2, group: "A", home: "USA", away: "Paraguay", date: "2026-06-12", time: "21:00", venue: "Los Angeles" },
  { id: 3, group: "A", home: "Mexico", away: "Paraguay", date: "2026-06-16", time: "18:00", venue: "Mexico City" },
  { id: 4, group: "A", home: "USA", away: "South Africa", date: "2026-06-16", time: "21:00", venue: "New York" },
  { id: 5, group: "A", home: "Mexico", away: "USA", date: "2026-06-22", time: "21:00", venue: "Dallas" },
  { id: 6, group: "A", home: "South Africa", away: "Paraguay", date: "2026-06-22", time: "21:00", venue: "Seattle" },

  // GRUPP B
  { id: 7, group: "B", home: "Canada", away: "Bosnia & Herzegovina", date: "2026-06-12", time: "18:00", venue: "Toronto" },
  { id: 8, group: "B", home: "Argentina", away: "Serbia", date: "2026-06-12", time: "00:00", venue: "Miami" },
  { id: 9, group: "B", home: "Canada", away: "Argentina", date: "2026-06-17", time: "00:00", venue: "Vancouver" },
  { id: 10, group: "B", home: "Bosnia & Herzegovina", away: "Serbia", date: "2026-06-16", time: "21:00", venue: "Dallas" },
  { id: 11, group: "B", home: "Serbia", away: "Canada", date: "2026-06-21", time: "18:00", venue: "Seattle" },
  { id: 12, group: "B", home: "Bosnia & Herzegovina", away: "Argentina", date: "2026-06-21", time: "21:00", venue: "Los Angeles" },

  // GRUPP C
  { id: 13, group: "C", home: "Spain", away: "Portugal", date: "2026-06-13", time: "00:00", venue: "Kansas City" },
  { id: 14, group: "C", home: "Morocco", away: "Senegal", date: "2026-06-13", time: "18:00", venue: "Toronto" },
  { id: 15, group: "C", home: "Spain", away: "Morocco", date: "2026-06-17", time: "21:00", venue: "Miami" },
  { id: 16, group: "C", home: "Portugal", away: "Senegal", date: "2026-06-17", time: "18:00", venue: "Atlanta" },
  { id: 17, group: "C", home: "Portugal", away: "Morocco", date: "2026-06-22", time: "18:00", venue: "Chicago" },
  { id: 18, group: "C", home: "Senegal", away: "Spain", date: "2026-06-22", time: "18:00", venue: "New York" },

  // GRUPP D
  { id: 19, group: "D", home: "France", away: "Senegal", date: "2026-06-16", time: "00:00", venue: "New York" },
  { id: 20, group: "D", home: "Brazil", away: "Morocco", date: "2026-06-13", time: "21:00", venue: "Houston" },
  { id: 21, group: "D", home: "France", away: "Brazil", date: "2026-06-19", time: "00:00", venue: "Dallas" },
  { id: 22, group: "D", home: "Morocco", away: "Senegal", date: "2026-06-18", time: "21:00", venue: "Los Angeles" },
  { id: 23, group: "D", home: "Brazil", away: "Senegal", date: "2026-06-23", time: "18:00", venue: "Seattle" },
  { id: 24, group: "D", home: "France", away: "Morocco", date: "2026-06-23", time: "18:00", venue: "San Francisco" },

  // GRUPP E
  { id: 25, group: "E", home: "Germany", away: "Saudi Arabia", date: "2026-06-14", time: "18:00", venue: "New York" },
  { id: 26, group: "E", home: "Netherlands", away: "Ecuador", date: "2026-06-14", time: "21:00", venue: "Chicago" },
  { id: 27, group: "E", home: "Germany", away: "Netherlands", date: "2026-06-18", time: "18:00", venue: "Houston" },
  { id: 28, group: "E", home: "Saudi Arabia", away: "Ecuador", date: "2026-06-18", time: "21:00", venue: "Kansas City" },
  { id: 29, group: "E", home: "Netherlands", away: "Saudi Arabia", date: "2026-06-23", time: "21:00", venue: "Miami" },
  { id: 30, group: "E", home: "Ecuador", away: "Germany", date: "2026-06-23", time: "21:00", venue: "Atlanta" },

  // GRUPP F
  { id: 31, group: "F", home: "England", away: "Tunisia", date: "2026-06-14", time: "00:00", venue: "Miami" },
  { id: 32, group: "F", home: "Colombia", away: "Nigeria", date: "2026-06-14", time: "21:00", venue: "Los Angeles" },
  { id: 33, group: "F", home: "England", away: "Colombia", date: "2026-06-19", time: "21:00", venue: "New York" },
  { id: 34, group: "F", home: "Tunisia", away: "Nigeria", date: "2026-06-19", time: "18:00", venue: "Kansas City" },
  { id: 35, group: "F", home: "Colombia", away: "Tunisia", date: "2026-06-24", time: "18:00", venue: "Boston" },
  { id: 36, group: "F", home: "Nigeria", away: "England", date: "2026-06-24", time: "18:00", venue: "San Francisco" },

  // GRUPP G
  { id: 37, group: "G", home: "Japan", away: "Czech Republic", date: "2026-06-15", time: "18:00", venue: "Los Angeles" },
  { id: 38, group: "G", home: "Croatia", away: "Belgium", date: "2026-06-15", time: "21:00", venue: "Dallas" },
  { id: 39, group: "G", home: "Japan", away: "Croatia", date: "2026-06-19", time: "21:00", venue: "Houston" },
  { id: 40, group: "G", home: "Czech Republic", away: "Belgium", date: "2026-06-19", time: "18:00", venue: "Seattle" },
  { id: 41, group: "G", home: "Croatia", away: "Czech Republic", date: "2026-06-24", time: "21:00", venue: "San Francisco" },
  { id: 42, group: "G", home: "Belgium", away: "Japan", date: "2026-06-24", time: "21:00", venue: "Chicago" },

  // GRUPP H
  { id: 43, group: "H", home: "South Korea", away: "Colombia", date: "2026-06-15", time: "00:00", venue: "New York" },
  { id: 44, group: "H", home: "Australia", away: "Slovakia", date: "2026-06-15", time: "18:00", venue: "Atlanta" },
  { id: 45, group: "H", home: "South Korea", away: "Australia", date: "2026-06-20", time: "00:00", venue: "Kansas City" },
  { id: 46, group: "H", home: "Colombia", away: "Slovakia", date: "2026-06-19", time: "21:00", venue: "Dallas" },
  { id: 47, group: "H", home: "Australia", away: "Colombia", date: "2026-06-24", time: "21:00", venue: "Miami" },
  { id: 48, group: "H", home: "Slovakia", away: "South Korea", date: "2026-06-24", time: "21:00", venue: "Boston" },

  // GRUPP I
  { id: 49, group: "I", home: "Italy", away: "Albania", date: "2026-06-16", time: "18:00", venue: "Los Angeles" },
  { id: 50, group: "I", home: "Denmark", away: "Chile", date: "2026-06-16", time: "21:00", venue: "Vancouver" },
  { id: 51, group: "I", home: "Italy", away: "Denmark", date: "2026-06-20", time: "21:00", venue: "Chicago" },
  { id: 52, group: "I", home: "Albania", away: "Chile", date: "2026-06-20", time: "18:00", venue: "Houston" },
  { id: 53, group: "I", home: "Denmark", away: "Albania", date: "2026-06-25", time: "18:00", venue: "Atlanta" },
  { id: 54, group: "I", home: "Chile", away: "Italy", date: "2026-06-25", time: "18:00", venue: "Seattle" },

  // GRUPP J
  { id: 55, group: "J", home: "Iran", away: "Greece", date: "2026-06-16", time: "21:00", venue: "Dallas" },
  { id: 56, group: "J", home: "Uruguay", away: "Côte d'Ivoire", date: "2026-06-17", time: "00:00", venue: "San Francisco" },
  { id: 57, group: "J", home: "Iran", away: "Uruguay", date: "2026-06-21", time: "18:00", venue: "Houston" },
  { id: 58, group: "J", home: "Greece", away: "Côte d'Ivoire", date: "2026-06-20", time: "21:00", venue: "Miami" },
  { id: 59, group: "J", home: "Uruguay", away: "Greece", date: "2026-06-25", time: "21:00", venue: "New York" },
  { id: 60, group: "J", home: "Côte d'Ivoire", away: "Iran", date: "2026-06-25", time: "21:00", venue: "Kansas City" },

  // GRUPP K
  { id: 61, group: "K", home: "Portugal", away: "Hungary", date: "2026-06-17", time: "18:00", venue: "Toronto" },
  { id: 62, group: "K", home: "Algeria", away: "Egypt", date: "2026-06-17", time: "21:00", venue: "Boston" },
  { id: 63, group: "K", home: "Portugal", away: "Algeria", date: "2026-06-21", time: "21:00", venue: "New York" },
  { id: 64, group: "K", home: "Hungary", away: "Egypt", date: "2026-06-21", time: "18:00", venue: "Los Angeles" },
  { id: 65, group: "K", home: "Algeria", away: "Hungary", date: "2026-06-26", time: "18:00", venue: "Chicago" },
  { id: 66, group: "K", home: "Egypt", away: "Portugal", date: "2026-06-26", time: "18:00", venue: "Dallas" },

  // GRUPP L
  { id: 67, group: "L", home: "Ukraine", away: "Jamaica", date: "2026-06-17", time: "21:00", venue: "Seattle" },
  { id: 68, group: "L", home: "Poland", away: "Turkey", date: "2026-06-17", time: "18:00", venue: "Atlanta" },
  { id: 69, group: "L", home: "Ukraine", away: "Poland", date: "2026-06-22", time: "00:00", venue: "Kansas City" },
  { id: 70, group: "L", home: "Jamaica", away: "Turkey", date: "2026-06-22", time: "00:00", venue: "Houston" },
  { id: 71, group: "L", home: "Poland", away: "Jamaica", date: "2026-06-26", time: "18:00", venue: "San Francisco" },
  { id: 72, group: "L", home: "Turkey", away: "Ukraine", date: "2026-06-26", time: "18:00", venue: "Miami" },
];

export const DEADLINE = new Date("2026-06-11T19:00:00"); // 19:00 CET dag 1

import { TaxonomyMapper } from '../types';

// This mapping is trying to map Apple podcast categories
// (https://podcasters.apple.com/support/1691-apple-podcasts-categories)
// to IAB Content Taxonomy v2.2
// (https://github.com/InteractiveAdvertisingBureau/Taxonomies/blob/main/Content%20Taxonomies/Content%20Taxonomy%202.2.tsv)
// Mapping prepared by AI with human review

export const appleToContent22mapping: { [key: string]: number[] } = {
  arts: [201], // Fine Art
  books: [42], // Books and Literature
  design: [201, 204], // Fine Art > Design
  'fashion & beauty': [552], // Style & Fashion
  food: [210], // Food & Drink
  'performing arts': [201, 209], // Fine Art > Theater
  'visual arts': [201], // Fine Art (same as Arts)
  business: [52, 53], // Business and Finance > Business
  careers: [123], // Careers
  entrepreneurship: [52, 53, 61], // Business and Finance > Business > Startups
  investing: [391, 410], // Personal Finance > Personal Investing
  management: [52, 53, 76], // Business and Finance > Business > Executive Leadership & Management
  marketing: [52, 53, 58], // Business and Finance > Business > Marketing and Advertising
  'non-profit': [52, 90, 108], // Business and Finance > Industries > Non-Profit Organizations
  comedy: [432, 440], // Pop Culture > Humor and Satire
  'comedy interviews': [432, 440], // Pop Culture > Humor and Satire
  improv: [432, 440], // Pop Culture > Humor and Satire
  'stand-up': [432, 440], // Pop Culture > Humor and Satire
  education: [132], // Education
  courses: [132, 148], // Education > Online Education
  'how to': [239, 247], // Hobbies & Interests > Workshops and Classes
  'language learning': [132, 147], // Education > Language Learning
  'self-improvement': [132, 133], // Education > Adult Education
  fiction: [42, 48], // Books and Literature > Fiction
  'comedy fiction': [42, 48], // Books and Literature > Fiction
  drama: [324, 333], // Movies > Drama Movies
  'science fiction': [324, 327], // Movies > Science Fiction Movies
  government: [52, 53, 77], // Business and Finance > Business > Government Business
  history: [150, 153], // Events and Attractions > Historic Site and Landmark Tours
  'health & fitness': [223], // Healthy Living
  'alternative health': [223, 232, 233], // Healthy Living > Wellness > Alternative Medicine
  fitness: [223, 225], // Healthy Living > Fitness and Exercise
  medicine: [286], // Medical Health
  'mental health': [286, 287, 301], // Medical Health > Diseases and Conditions > Mental Health
  nutrition: [223, 229], // Healthy Living > Nutrition
  sexuality: [286, 287, 307], // Medical Health > Diseases and Conditions > Sexual Health
  'kids & family': [186], // Family and Relationships
  'education for kids': [132, 142], // Education > Early Childhood Education
  parenting: [186, 192], // Family and Relationships > Parenting
  'pets & animals': [422], // Pets
  'stories for kids': [42, 45], // Books and Literature > Children's Literature
  leisure: [239], // Hobbies & Interests
  'animation & manga': [324, 329], // Movies > Animation Movies
  automotive: [1], // Automotive
  aviation: [52, 90, 118], // Business and Finance > Industries > Aviation Industry
  crafts: [239, 248], // Hobbies & Interests > Arts and Crafts
  games: [239, 269], // Hobbies & Interests > Games and Puzzles
  hobbies: [239], // Hobbies & Interests
  'home & garden': [274], // Home & Garden
  'video games': [680], // Video Gaming
  music: [338], // Music and Audio
  'music commentary': [338], // Music and Audio
  'music history': [338], // Music and Audio
  'music interviews': [338], // Music and Audio
  news: [379], // News and Politics
  'business news': [338, 371, 372], // Music and Audio > Talk Radio > Business News Radio
  'daily news': [338, 371, 374], // Music and Audio > Talk Radio > News Radio
  'entertainment news': [379, 384], // News and Politics > Local News
  'news commentary': [338, 371, 375], // Music and Audio > Talk Radio > News/Talk Radio
  politics: [379, 386], // News and Politics > Politics
  'sports news': [338, 370], // Music and Audio > Sports Radio
  'tech news': [379, 596], // Technology & Computing
  'religion & spirituality': [453], // Religion & Spirituality
  buddhism: [453, 458], // Religion & Spirituality > Buddhism
  christianity: [453, 459], // Religion & Spirituality > Christianity
  hinduism: [453, 460], // Religion & Spirituality > Hinduism
  islam: [453, 461], // Religion & Spirituality > Islam
  judaism: [453, 462], // Religion & Spirituality > Judaism
  religion: [453], // Religion & Spirituality
  spirituality: [453, 455], // Religion & Spirituality > Spirituality
  science: [464], // Science
  astronomy: [464, 472], // Science > Space and Astronomy
  chemistry: [464, 466], // Science > Chemistry
  'earth sciences': [464, 470], // Science > Geology
  'life sciences': [464, 465], // Science > Biological Sciences
  mathematics: [464], // Science (no specific subcategory)
  'natural sciences': [464], // Science (no specific subcategory)
  nature: [150, 160], // Events and Attractions > Parks & Nature
  physics: [464, 471], // Science > Physics
  'social sciences': [464], // Science (no specific subcategory)
  'society & culture': [379], // News and Politics
  documentary: [324, 332], // Movies > Documentary Movies
  'personal journals': [379], // News and Politics (no specific subcategory)
  philosophy: [379], // News and Politics (no specific subcategory)
  'places & travel': [653], // Travel
  relationships: [186], // Family and Relationships
  sports: [483], // Sports
  baseball: [483, 545], // Sports > Baseball
  basketball: [483, 547], // Sports > Basketball
  cricket: [483, 491], // Sports > Cricket
  'fantasy sports': [483, 508], // Sports > Fantasy Sports
  football: [483, 484], // Sports > American Football
  golf: [483, 512], // Sports > Golf
  hockey: [483, 515], // Sports > Ice Hockey
  rugby: [483, 527], // Sports > Rugby
  running: [223, 225, 227], // Healthy Living > Fitness and Exercise > Running and Jogging
  soccer: [483, 533], // Sports > Soccer
  swimming: [483, 537], // Sports > Swimming
  tennis: [483, 539], // Sports > Tennis
  volleyball: [483, 541], // Sports > Volleyball
  wilderness: [150, 159], // Events and Attractions > Outdoor Activities
  wrestling: [483, 546], // Sports > Wrestling
  technology: [596], // Technology & Computing
  'true crime': [379, 380], // News and Politics > Crime
  'tv & film': [324], // Movies
  'after shows': [640], // Television
  'film history': [324], // Movies (no specific subcategory)
  'film interviews': [324], // Movies (no specific subcategory)
  'film reviews': [324], // Movies (no specific subcategory)
  'tv reviews': [640], // Television
};

export const applePodcastToContent22: TaxonomyMapper = (category: string) => {
  return (appleToContent22mapping[category.toLowerCase()] || []).map(String);
};

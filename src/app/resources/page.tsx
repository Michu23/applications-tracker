'use client';

const RESOURCES = [
  {
    category: 'Official Portals',
    items: [
      {
        name: 'DAAD - German Academic Exchange Service',
        description: 'Official database of all German universities and programs. Search for Master programs, scholarships, and funding opportunities.',
        url: 'https://www.daad.de/en/study-and-research-in-germany/courses-of-study-in-germany/all-study-programmes-in-germany/',
        tags: ['Programs', 'Scholarships'],
      },
      {
        name: 'Hochschulkompass',
        description: 'Official higher education compass with comprehensive database of all study programs at German universities.',
        url: 'https://www.hochschulkompass.de/en/study-in-germany.html',
        tags: ['Programs', 'Official'],
      },
      {
        name: 'Study in Germany',
        description: 'Official portal with information about studying in Germany, including visa, accommodation, and living costs.',
        url: 'https://www.study-in-germany.de/en/',
        tags: ['General Info', 'Visa'],
      },
    ],
  },
  {
    category: 'Application Services',
    items: [
      {
        name: 'Uni-Assist',
        description: 'Central application service for international students. Many German universities require applications through Uni-Assist.',
        url: 'https://www.uni-assist.de/en/',
        tags: ['Application', 'Required'],
      },
      {
        name: 'Anabin Database',
        description: 'Check if your degree is recognized in Germany. Essential for verifying your qualification equivalence.',
        url: 'https://anabin.kmk.org/anabin.html',
        tags: ['Credential Check'],
      },
    ],
  },
  {
    category: 'Program Search Platforms',
    items: [
      {
        name: 'Masters Portal',
        description: 'Search engine for Master programs worldwide. Filter by country, subject, and language of instruction.',
        url: 'https://www.mastersportal.com/countries/6/germany.html',
        tags: ['Search', 'Comparison'],
      },
      {
        name: 'Study Portals - Germany',
        description: 'Comprehensive listing of English-taught Master programs in Germany with detailed information.',
        url: 'https://www.studyportals.com/study-in-germany/',
        tags: ['Search', 'English Programs'],
      },
      {
        name: 'DAAD Summer 2026 Programs',
        description: 'Direct link to search for programs starting in Summer Semester 2026.',
        url: 'https://www2.daad.de/deutschland/studienangebote/international-programmes/en/',
        tags: ['Summer 2026', 'Programs'],
      },
    ],
  },
  {
    category: 'Top Public Universities',
    items: [
      {
        name: 'TU Munich (TUM)',
        description: 'Technical University of Munich - One of Germany\'s top technical universities.',
        url: 'https://www.tum.de/en/studies/application',
        tags: ['Technical', 'Munich'],
      },
      {
        name: 'LMU Munich',
        description: 'Ludwig Maximilian University - Leading research university in Munich.',
        url: 'https://www.lmu.de/en/study/all-degrees-and-programs/',
        tags: ['Research', 'Munich'],
      },
      {
        name: 'RWTH Aachen',
        description: 'One of the largest technical universities in Europe, known for engineering.',
        url: 'https://www.rwth-aachen.de/cms/root/studium/Im-Studium/~hiwt/Studieren-im-Sommersemester/',
        tags: ['Technical', 'Aachen'],
      },
      {
        name: 'TU Berlin',
        description: 'Technical University of Berlin - Major technical university in the capital.',
        url: 'https://www.tu.berlin/en/studying/study-programs/',
        tags: ['Technical', 'Berlin'],
      },
      {
        name: 'Heidelberg University',
        description: 'Germany\'s oldest university, known for research excellence.',
        url: 'https://www.uni-heidelberg.de/en/study/all-subjects',
        tags: ['Research', 'Heidelberg'],
      },
      {
        name: 'University of Stuttgart',
        description: 'Leading technical university with strong industry connections.',
        url: 'https://www.uni-stuttgart.de/en/study/application/',
        tags: ['Technical', 'Stuttgart'],
      },
      {
        name: 'KIT - Karlsruhe Institute of Technology',
        description: 'Excellent for engineering and natural sciences.',
        url: 'https://www.kit.edu/english/studying.php',
        tags: ['Technical', 'Karlsruhe'],
      },
      {
        name: 'University of Freiburg',
        description: 'One of Germany\'s oldest and most renowned research universities.',
        url: 'https://www.studium.uni-freiburg.de/en/programs',
        tags: ['Research', 'Freiburg'],
      },
    ],
  },
  {
    category: 'Scholarships & Funding',
    items: [
      {
        name: 'DAAD Scholarships',
        description: 'Comprehensive database of scholarships for international students in Germany.',
        url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
        tags: ['Scholarships', 'Funding'],
      },
      {
        name: 'Deutschlandstipendium',
        description: 'Germany Scholarship program - Merit-based scholarship available at many universities.',
        url: 'https://www.deutschlandstipendium.de/en/',
        tags: ['Merit-based', 'Funding'],
      },
      {
        name: 'StudyBee Scholarship Finder',
        description: 'Search engine for scholarships to study in Germany.',
        url: 'https://www.mystipendium.de/',
        tags: ['Search', 'Funding'],
      },
    ],
  },
  {
    category: 'Important Deadlines - Summer 2026',
    items: [
      {
        name: 'Uni-Assist Deadline Info',
        description: 'Most universities: Application deadline for Summer 2026 is typically January 15, 2026. Uni-Assist deadline is usually 4-6 weeks earlier.',
        url: 'https://www.uni-assist.de/en/tools/deadline-calculator/',
        tags: ['Deadlines', 'Important'],
      },
      {
        name: 'TU Munich Summer Application',
        description: 'TUM application portal - Check specific deadlines for your program.',
        url: 'https://www.tum.de/en/studies/application/dates-and-deadlines',
        tags: ['Deadlines', 'TUM'],
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">German University Resources</h1>
          <p className="text-gray-500 mt-2">
            Essential links and resources for applying to Master&apos;s programs in Germany for Summer 2026
          </p>
        </div>

        {/* Quick Tips */}
        <div className="bg-[#2979FF]/5 border border-[#2979FF]/20 rounded-xl p-5">
          <h2 className="font-semibold text-[#2979FF] mb-3">Quick Tips for Summer 2026 Applications</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#2979FF] mt-0.5">•</span>
              <span><strong>Start early:</strong> Application deadlines are typically in January 2026, but Uni-Assist requires earlier submission.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2979FF] mt-0.5">•</span>
              <span><strong>Check Uni-Assist:</strong> Many universities require applications through Uni-Assist - verify this for each program.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2979FF] mt-0.5">•</span>
              <span><strong>Language requirements:</strong> Most English programs require IELTS 6.5+ or equivalent. Some may require German proficiency.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2979FF] mt-0.5">•</span>
              <span><strong>Semester contribution:</strong> German public universities are tuition-free, but charge a semester fee (usually 150-400 EUR).</span>
            </li>
          </ul>
        </div>

        {/* Resources by Category */}
        {RESOURCES.map((category) => (
          <div key={category.category} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-[#2979FF]/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#2979FF] transition-colors">
                      {item.name}
                    </h3>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-[#2979FF] flex-shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Footer Note */}
        <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
          <p>
            <strong>Note:</strong> Always verify deadlines and requirements directly on university websites,
            as they may change. Application periods for Summer Semester 2026 typically open in October/November 2025.
          </p>
        </div>
      </div>
    </div>
  );
}

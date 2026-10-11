export const SKILLS_LIST: string[] = [
  // --- AI / Machine Learning ---
  'AI', 'AI Automation', 'AI Prompt Engineering', 'Artificial Intelligence',
  'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'NLP',
  'Computer Vision', 'Large Language Models', 'LLM Fine-Tuning', 'OpenAI API',
  'LangChain', 'RAG (Retrieval Augmented Generation)', 'TensorFlow', 'PyTorch',
  'Keras', 'Hugging Face', 'Transformers', 'Reinforcement Learning',
  'Generative AI', 'ChatGPT', 'Stable Diffusion', 'Midjourney',
  'Model Deployment', 'MLOps', 'Feature Engineering', 'Model Optimization',
  'Neural Networks', 'Statistical Modeling', 'Time Series Forecasting',

  // --- Programming Languages ---
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C',
  'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart',
  'Scala', 'R', 'MATLAB', 'Perl', 'Lua', 'Groovy', 'Elixir', 'Haskell',
  'Objective-C', 'Shell Scripting', 'Bash', 'PowerShell', 'VBA',

  // --- Web Development ---
  'React', 'React Native', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular',
  'Svelte', 'SvelteKit', 'Ember.js', 'Backbone.js', 'jQuery',
  'Node.js', 'Express.js', 'NestJS', 'Deno', 'Bun',
  'HTML5', 'CSS3', 'Tailwind CSS', 'Sass', 'SCSS', 'Less',
  'Bootstrap', 'Material UI', 'Chakra UI', 'Radix UI', 'shadcn/ui',
  'GraphQL', 'Apollo GraphQL', 'REST API', 'gRPC', 'WebSockets',
  'Webpack', 'Vite', 'Rollup', 'Parcel', 'Turbopack',
  'Redux', 'Zustand', 'MobX', 'Recoil', 'Jotai',
  'Three.js', 'D3.js', 'Chart.js', 'GSAP', 'Framer Motion',
  'Storybook', 'Laravel', 'Django', 'Flask', 'FastAPI',
  'Ruby on Rails', 'Spring Boot', 'ASP.NET', 'ASP.NET Core',
  'Gatsby', 'Remix', 'Astro', 'Solid.js', 'Qwik',

  // --- Mobile Development ---
  'Android Development', 'iOS Development', 'Flutter', 'Xamarin',
  'Ionic', 'Cordova', 'React Native', 'Expo', 'MAUI',

  // --- Cloud & DevOps ---
  'AWS', 'AWS Lambda', 'AWS EC2', 'AWS S3', 'AWS RDS', 'AWS ECS',
  'Azure', 'Azure Functions', 'Azure DevOps',
  'Google Cloud Platform', 'GCP', 'Firebase', 'Supabase',
  'Docker', 'Kubernetes', 'Helm', 'Terraform', 'Ansible',
  'Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'CircleCI',
  'CI/CD', 'DevOps', 'DevSecOps', 'Platform Engineering',
  'Cloudflare', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean',
  'Linux', 'Ubuntu', 'CentOS', 'Debian', 'Nginx', 'Apache',
  'Prometheus', 'Grafana', 'ELK Stack', 'Datadog', 'Sentry',

  // --- Databases ---
  'SQL', 'PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'Oracle SQL',
  'Microsoft SQL Server', 'MongoDB', 'Redis', 'Cassandra', 'DynamoDB',
  'Elasticsearch', 'Neo4j', 'Supabase', 'Prisma', 'Drizzle ORM',
  'Sequelize', 'TypeORM', 'Mongoose', 'SQLAlchemy',
  'Database Design', 'Data Modeling', 'ETL', 'DBA',

  // --- Data Science & Analytics ---
  'Data Science', 'Data Analysis', 'Data Visualization', 'Data Engineering',
  'Pandas', 'NumPy', 'SciPy', 'Scikit-learn', 'Jupyter Notebook',
  'Tableau', 'Power BI', 'Looker', 'Google Analytics', 'Google Analytics 4',
  'Excel', 'Advanced Excel', 'Pivot Tables', 'VLOOKUP', 'SPSS',
  'SAS', 'Stata', 'Apache Spark', 'Apache Hadoop', 'Apache Kafka',
  'Apache Airflow', 'dbt', 'Snowflake', 'BigQuery', 'Databricks',
  'Data Mining', 'Business Intelligence', 'BI', 'A/B Testing',
  'Statistical Analysis', 'Hypothesis Testing', 'Regression Analysis',

  // --- Design ---
  'Adobe Photoshop', 'Adobe Illustrator', 'Adobe XD', 'Adobe InDesign',
  'Adobe After Effects', 'Adobe Premiere Pro', 'Adobe Lightroom',
  'Figma', 'Sketch', 'Canva', 'Framer', 'InVision',
  'UI Design', 'UX Design', 'UI/UX Design', 'User Research',
  'Wireframing', 'Prototyping', 'Design Systems', 'Design Thinking',
  'Typography', 'Color Theory', 'Branding', 'Logo Design',
  'Motion Graphics', '3D Modeling', 'Blender', 'Maya', 'Cinema 4D',
  'AutoCAD', 'SketchUp', 'Revit', 'SolidWorks', 'CATIA',
  'InDesign', 'Graphic Design', 'Web Design', 'Product Design',
  'Interaction Design', 'User Journey Mapping', 'Persona Creation',

  // --- Marketing ---
  'Digital Marketing', 'SEO', 'SEM', 'Google Ads', 'Google Search Console',
  'Content Marketing', 'Content Strategy', 'Copywriting', 'Technical Writing',
  'Social Media Marketing', 'Social Media Management', 'Facebook Ads',
  'Instagram Marketing', 'LinkedIn Marketing', 'TikTok Marketing',
  'Email Marketing', 'Mailchimp', 'HubSpot', 'Klaviyo', 'SendGrid',
  'Marketing Automation', 'Marketing Analytics', 'Google Tag Manager',
  'Conversion Rate Optimization', 'CRO', 'Affiliate Marketing',
  'Influencer Marketing', 'Brand Management', 'Public Relations',
  'Growth Hacking', 'Customer Acquisition', 'Lead Generation',
  'PPC Advertising', 'Programmatic Advertising', 'Display Advertising',

  // --- Business & Finance ---
  'Business Analysis', 'Business Development', 'Project Management',
  'Agile', 'Scrum', 'Kanban', 'SAFe', 'Lean',
  'Jira', 'Confluence', 'Trello', 'Asana', 'Monday.com', 'Notion',
  'MS Project', 'Primavera P6', 'Risk Management', 'Stakeholder Management',
  'Financial Analysis', 'Financial Modeling', 'Accounting', 'Bookkeeping',
  'QuickBooks', 'SAP', 'SAP FICO', 'Oracle Financials',
  'Excel Financial Modeling', 'Valuation', 'DCF Analysis',
  'Supply Chain Management', 'Logistics', 'Procurement', 'Inventory Management',
  'Operations Management', 'Quality Management', 'Six Sigma',
  'Lean Six Sigma', 'ISO 9001', 'Strategic Planning', 'Change Management',
  'Sales', 'B2B Sales', 'B2C Sales', 'CRM', 'Salesforce',
  'Negotiation', 'Contract Management', 'Budgeting', 'Forecasting',
  'Pricing Strategy', 'Market Research', 'Competitive Analysis',
  'Entrepreneurship', 'Startup Management', 'Fundraising', 'Pitch Deck',
  'Product Management', 'Product Roadmap', 'Product Strategy',
  'User Stories', 'Backlog Grooming', 'Sprint Planning',

  // --- Cybersecurity ---
  'Cybersecurity', 'Information Security', 'Network Security',
  'Penetration Testing', 'Ethical Hacking', 'Vulnerability Assessment',
  'OWASP', 'Burp Suite', 'Metasploit', 'Wireshark', 'Nmap',
  'SIEM', 'Splunk', 'ISO 27001', 'NIST Framework', 'GDPR Compliance',
  'Risk Assessment', 'Security Auditing', 'Incident Response',
  'Cryptography', 'PKI', 'IAM', 'Zero Trust', 'Kali Linux',

  // --- Networking & IT ---
  'Networking', 'TCP/IP', 'DNS', 'VPN', 'Cisco', 'CCNA', 'CCNP',
  'Routing', 'Switching', 'Firewall', 'Load Balancing', 'CDN',
  'Active Directory', 'Windows Server', 'VMware', 'Virtualization',
  'Hyper-V', 'Proxmox', 'IT Support', 'Help Desk', 'System Administration',

  // --- Soft Skills ---
  'Leadership', 'Team Management', 'Communication', 'Verbal Communication',
  'Written Communication', 'Presentation Skills', 'Public Speaking',
  'Problem Solving', 'Critical Thinking', 'Analytical Thinking',
  'Decision Making', 'Time Management', 'Organization', 'Multitasking',
  'Adaptability', 'Flexibility', 'Creativity', 'Innovation',
  'Collaboration', 'Teamwork', 'Conflict Resolution', 'Mentoring',
  'Coaching', 'Delegation', 'Emotional Intelligence', 'Empathy',
  'Active Listening', 'Stress Management', 'Resilience', 'Self-Motivated',
  'Attention to Detail', 'Interpersonal Skills', 'Cross-Functional Collaboration',
  'Customer Service', 'Customer Success', 'Client Relations',
  'Negotiation Skills', 'Persuasion', 'Storytelling', 'Work Ethic',

  // --- Testing & QA ---
  'Software Testing', 'Manual Testing', 'Automated Testing', 'Selenium',
  'Cypress', 'Playwright', 'Jest', 'Vitest', 'Mocha', 'Chai',
  'Testing Library', 'JUnit', 'TestNG', 'PyTest', 'PHPUnit',
  'Load Testing', 'JMeter', 'K6', 'Gatling', 'Postman',
  'API Testing', 'End-to-End Testing', 'Unit Testing', 'Integration Testing',
  'TDD', 'BDD', 'Cucumber', 'QA', 'Quality Assurance',
  'Bug Tracking', 'JIRA Bug Tracking', 'Test Cases', 'Test Plans',

  // --- Version Control ---
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Version Control',
  'Branching Strategy', 'Code Review', 'Pull Requests', 'Rebase',

  // --- Blockchain & Web3 ---
  'Blockchain', 'Solidity', 'Ethereum', 'Smart Contracts', 'Web3',
  'NFT', 'DeFi', 'Hardhat', 'Truffle', 'Remix IDE',
  'Cryptography', 'Decentralized Apps', 'DApp Development',

  // --- Game Development ---
  'Unity', 'Unreal Engine', 'Godot', 'Game Design', 'C# for Games',
  '2D Game Development', '3D Game Development', 'Level Design',

  // --- Languages (Human) ---
  'English', 'Urdu', 'Hindi', 'Arabic', 'Chinese', 'Mandarin',
  'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Portuguese',
  'Russian', 'Turkish', 'Italian', 'Dutch', 'Farsi', 'Punjabi',
  'Sindhi', 'Pashto', 'Bengali',

  // --- Other / Tools ---
  'Microsoft Office', 'MS Word', 'MS Excel', 'MS PowerPoint',
  'MS Access', 'MS Outlook', 'Google Workspace', 'Google Docs',
  'Google Sheets', 'Google Slides', 'Slack', 'Zoom', 'Teams',
  'Data Entry', 'Typing Speed', 'Research Skills', 'Documentation',
  'Process Automation', 'RPA', 'UiPath', 'Power Automate',
  'Zapier', 'Make (Integromat)', 'n8n', 'IFTTT',
];

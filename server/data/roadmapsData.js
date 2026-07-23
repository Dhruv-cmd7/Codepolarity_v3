const roadmapsData = {
  ai: {
    id: 'ai',
    title: 'AI Developer Roadmap',
    description: 'Learn the mathematical foundations, machine learning pipelines, deep learning structures, and large language models.',
    nodes: [
      {
        id: 'ai-python',
        title: 'Python & Data Libraries',
        level: 'Beginner',
        description: 'Master Python fundamentals, file handling, and core data libraries like NumPy and Pandas for data manipulation.',
        resources: [
          { name: 'Python for Beginners (freeCodeCamp)', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', type: 'Video' },
          { name: 'Official Python Documentation', url: 'https://docs.python.org/3/', type: 'Docs' },
          { name: 'Pandas & NumPy Tutorial (Kaggle)', url: 'https://www.kaggle.com/learn/pandas', type: 'Interactive' }
        ],
        connections: ['ai-math']
      },
      {
        id: 'ai-math',
        title: 'ML Math Foundations',
        level: 'Beginner',
        description: 'Understand the essential mathematics: Linear Algebra (matrices, vectors), Calculus (derivatives, gradients), and Probability.',
        resources: [
          { name: 'Linear Algebra for Machine Learning (3Blue1Brown)', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'Video' },
          { name: 'Mathematics for Machine Learning Book', url: 'https://mml-book.github.io/', type: 'Book' }
        ],
        connections: ['ai-ml-basics']
      },
      {
        id: 'ai-ml-basics',
        title: 'Classical Machine Learning',
        level: 'Intermediate',
        description: 'Learn supervised & unsupervised learning, regressions, decision trees, SVMs, and Scikit-Learn pipelines.',
        resources: [
          { name: 'Machine Learning Zoomcamp', url: 'https://github.com/alexeygrigorev/mlbookcamp-code/tree/master/course-zoomcamp', type: 'Course' },
          { name: 'Scikit-Learn Official User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', type: 'Docs' }
        ],
        connections: ['ai-deep-learning']
      },
      {
        id: 'ai-deep-learning',
        title: 'Deep Learning & Neural Networks',
        level: 'Intermediate',
        description: 'Explore neural networks, backpropagation, activation functions, and deep learning framework PyTorch.',
        resources: [
          { name: 'Practical Deep Learning for Coders (Fast.ai)', url: 'https://course.fast.ai/', type: 'Course' },
          { name: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', type: 'Docs' },
          { name: 'Deep Learning Specialization (Andrew Ng)', url: 'https://www.coursera.org/specializations/deep-learning', type: 'Course' }
        ],
        connections: ['ai-advanced']
      },
      {
        id: 'ai-advanced',
        title: 'NLP, Transformers & LLMs',
        level: 'Advanced',
        description: 'Learn sequence models, transformer architectures, LLM fine-tuning, retrieval augmented generation (RAG), and prompt engineering.',
        resources: [
          { name: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', type: 'Course' },
          { name: 'Andrej Karpathy - Intro to LLMs', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g', type: 'Video' },
          { name: 'LLM University by Cohere', url: 'https://cohere.com/llmu', type: 'Course' }
        ],
        connections: []
      }
    ]
  },
  frontend: {
    id: 'frontend',
    title: 'Frontend Web Developer Roadmap',
    description: 'Learn to design and build stunning, responsive user interfaces, master JavaScript React, and deploy production apps.',
    nodes: [
      {
        id: 'fe-html-css',
        title: 'HTML5 & CSS3 Essentials',
        level: 'Beginner',
        description: 'Learn semantic HTML structure, CSS layout techniques (Flexbox, Grid), media queries, and responsive web design.',
        resources: [
          { name: 'Responsive Web Design (freeCodeCamp)', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'Interactive' },
          { name: 'MDN Web Docs - HTML & CSS', url: 'https://developer.mozilla.org/en-US/docs/Learn', type: 'Docs' }
        ],
        connections: ['fe-js-basics']
      },
      {
        id: 'fe-js-basics',
        title: 'JavaScript & DOM Manipulation',
        level: 'Beginner',
        description: 'Understand JS syntax, data types, ES6 features, asynchronous operations (Promises, async/await), and DOM interaction.',
        resources: [
          { name: 'JavaScript Info', url: 'https://javascript.info/', type: 'Docs' },
          { name: 'JavaScript Basics Course (Scrimba)', url: 'https://scrimba.com/learn/learnjavascript', type: 'Course' }
        ],
        connections: ['fe-tooling']
      },
      {
        id: 'fe-tooling',
        title: 'Git & Frontend Development Tooling',
        level: 'Intermediate',
        description: 'Master Git version control, npm package management, and bundling tools like Vite.',
        resources: [
          { name: 'Git & GitHub Crash Course', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', type: 'Video' },
          { name: 'Learn Git Branching', url: 'https://learngitbranching.js.org/', type: 'Interactive' }
        ],
        connections: ['fe-react']
      },
      {
        id: 'fe-react',
        title: 'React.js Component Architecture',
        level: 'Intermediate',
        description: 'Build modular UIs using React hooks (useState, useEffect, useContext), state management, routing, and standard APIs.',
        resources: [
          { name: 'Official React Documentation', url: 'https://react.dev/', type: 'Docs' },
          { name: 'React Course (Scrimba)', url: 'https://scrimba.com/learn/learnreact', type: 'Course' }
        ],
        connections: ['fe-advanced']
      },
      {
        id: 'fe-advanced',
        title: 'Next.js & Modern Web Concepts',
        level: 'Advanced',
        description: 'Understand Server-Side Rendering (SSR), Static Site Generation (SSG), caching, performance optimization, and web security.',
        resources: [
          { name: 'Next.js Learn Course', url: 'https://nextjs.org/learn', type: 'Course' },
          { name: 'Web Performance Optimization (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/Performance', type: 'Docs' }
        ],
        connections: []
      }
    ]
  },
  backend: {
    id: 'backend',
    title: 'Backend Web Developer Roadmap',
    description: 'Learn server-side logic, database query optimization, security principles, API routing, and cloud deployment.',
    nodes: [
      {
        id: 'be-basics',
        title: 'Command Line & Networking Basics',
        level: 'Beginner',
        description: 'Learn terminal navigation, basic shell commands, and how the internet works (HTTP, DNS, Ports, Client-Server model).',
        resources: [
          { name: 'How the Internet Works', url: 'https://www.youtube.com/watch?v=7_LPdttKXPc', type: 'Video' },
          { name: 'Linux Command Line Basics', url: 'https://www.youtube.com/watch?v=wBp0Rb-ZJak', type: 'Video' }
        ],
        connections: ['be-node-express']
      },
      {
        id: 'be-node-express',
        title: 'Node.js & Express APIs',
        level: 'Beginner',
        description: 'Build backend servers, write REST API routes, handle request/response cycles, and manage package dependencies.',
        resources: [
          { name: 'Node.js & Express Course (freeCodeCamp)', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', type: 'Video' },
          { name: 'Express Official Documentation', url: 'https://expressjs.com/', type: 'Docs' }
        ],
        connections: ['be-databases']
      },
      {
        id: 'be-databases',
        title: 'Databases (MongoDB & SQL)',
        level: 'Intermediate',
        description: 'Learn data modeling, CRUD operations, indexing, and comparison between Relational SQL (Postgres) and Document NoSQL (MongoDB).',
        resources: [
          { name: 'MongoDB University', url: 'https://learn.mongodb.com/', type: 'Course' },
          { name: 'SQL Tutorial (Khan Academy)', url: 'https://www.khanacademy.org/computing/computer-programming/sql', type: 'Interactive' }
        ],
        connections: ['be-security']
      },
      {
        id: 'be-security',
        title: 'Authentication & API Security',
        level: 'Intermediate',
        description: 'Implement secure login flows using JWT tokens, cookie-based sessions, bcrypt password hashing, and CORS middleware.',
        resources: [
          { name: 'Web Security (OWASP Top 10)', url: 'https://owasp.org/www-project-top-ten/', type: 'Docs' },
          { name: 'JWT Authentication Guide', url: 'https://dev.to/salome/jwt-authentication-with-node-js-and-express-370i', type: 'Read' }
        ],
        connections: ['be-cloud-ops']
      },
      {
        id: 'be-cloud-ops',
        title: 'Docker, Caching & Deployment',
        level: 'Advanced',
        description: 'Containerize backend servers with Docker, optimize database queries with Redis caching, and deploy apps to cloud platforms.',
        resources: [
          { name: 'Docker for Beginners', url: 'https://www.youtube.com/watch?v=3c-iKanqeec', type: 'Video' },
          { name: 'Redis Crash Course', url: 'https://www.youtube.com/watch?v=jgpVdJB2sKQ', type: 'Video' }
        ],
        connections: []
      }
    ]
  }
};

module.exports = roadmapsData;

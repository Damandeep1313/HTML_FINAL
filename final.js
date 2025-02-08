/*******************************************************
 * 1) INSTALL DEPENDENCIES:
 *    npm install express openai axios dotenv
 *
 * 2) .env must have:
 *    OPENAI_API_KEY=sk-...
 *    NETLIFY_AUTH_TOKEN=...
 *    NETLIFY_SITE_ID=...
 *******************************************************/

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

// -----------------------------
// 1) Setup OpenAI from .env
// -----------------------------
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// -----------------------------
// 2) Netlify Deploy Helper
// -----------------------------
async function deployHtmlToNetlify(htmlContent) {
  const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;
  const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;

  if (!NETLIFY_AUTH_TOKEN || !NETLIFY_SITE_ID) {
    throw new Error("Missing NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID in .env");
  }

  // Netlify Deploy API endpoint:
  const netlifyUrl = `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys`;

  // We'll post JSON with the "files" object containing /index.html
  const body = {
    files: {
      "/index.html": htmlContent,
    },
  };

  // Send to Netlify
  const response = await axios.post(netlifyUrl, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
    },
  });

  // Netlify typically returns deploy_url or deploy_ssl_url
  const deployUrl = response.data.deploy_ssl_url || response.data.deploy_url;
  return deployUrl;
}

// -----------------------------
// 3) Generate Landing Page HTML
// -----------------------------
// Defaults for testimonials if user didn't provide any
const DEFAULT_T1 = "https://media.istockphoto.com/id/1329039896/photo/young-doctor-asking-senior-impaired-male-patient-in-wheelchair-to-sign-insurance-policy-at.jpg?s=612x612&w=0&k=20&c=R4upVNBIIfZY3biFdivbrRei-paJuiQuLwYlkxx0dto=";
const DEFAULT_T2 = "https://picsum.photos/80/80?random=203";
const DEFAULT_T3 = "https://picsum.photos/80/80?random=201";

/**
 * Takes parsed JSON data and returns the HTML string.
 */
function generateLandingPageHtml(parsedData) {
  const {
    websiteNiche,
    doctorDetails,
    pageLinks = [],
    images = [],
    testimonialImages = [],
    faqs = []
  } = parsedData;

  if (!websiteNiche || !doctorDetails || !doctorDetails.name) {
    throw new Error('Missing required fields: websiteNiche, doctorDetails.name, etc.');
  }

  // Hero/About image
  const mainImage = images[0] || 'https://via.placeholder.com/1200x600?text=No+Hero+Image';

  // Arrays
  const specializationList = Array.isArray(doctorDetails.specialization)
    ? doctorDetails.specialization
    : [];
  const achievementsList = Array.isArray(doctorDetails.achievements)
    ? doctorDetails.achievements
    : [];
  const descriptionText = doctorDetails.description || '';

  // Testimonial images
  const t1 = testimonialImages[0] || DEFAULT_T1;
  const t2 = testimonialImages[1] || DEFAULT_T2;
  const t3 = testimonialImages[2] || DEFAULT_T3;

  // Build final HTML
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Luxury Services – ${doctorDetails.name} | ${websiteNiche.toUpperCase()} Prestige</title>
  <meta name="description" content="${doctorDetails.name} is a leading specialist in the ${websiteNiche} field. This page showcases specializations, achievements, and more." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Bootstrap 5 CSS -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
  >
  <!-- Bootstrap Icons -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
  >
  <!-- AOS CSS -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/aos@2.3.1/dist/aos.css"
  />
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap"
    rel="stylesheet"
  >

  <style>
    body {
      font-family: 'Poppins', sans-serif;
      color: #333;
      background-color: #f9f9f9;
      overflow-x: hidden;
    }
    .navbar-brand { font-weight: 700; }
    .hero-section {
      position: relative;
      height: 75vh;
      background: url('${mainImage}') center center / cover no-repeat fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-shadow: 2px 2px 6px rgba(0,0,0,0.5);
    }
    .hero-overlay {
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      background: rgba(0,0,0,0.4);
    }
    .hero-content h1 {
      font-size: 3rem;
      font-weight: 700;
    }
    .hero-content p {
      font-size: 1.3rem;
      font-weight: 300;
      margin-top: 0.5rem;
    }
    .cta-section {
      background: linear-gradient(135deg, #15aabf, #2fbfac);
      color: #fff;
      padding: 3rem 0;
      text-align: center;
    }
    .btn-cta {
      background-color: #fff;
      color: #15aabf;
      font-weight: 600;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      transition: background-color 0.3s ease;
    }
    .btn-cta:hover {
      background-color: #eee;
    }
    .list-group-item {
      border: 0;
      padding-left: 0;
    }
    .list-group-item i {
      color: #2fbfac;
      margin-right: 0.5rem;
    }
    .testimonial-carousel .carousel-item {
      padding: 2rem;
    }
    .testimonial-carousel .carousel-item img {
      width: 80px; height: 80px;
      object-fit: cover;
      border-radius: 50%;
    }
    .testimonial-carousel .carousel-item blockquote {
      font-style: italic;
      margin: 1.5rem 0;
    }
    .faq-section {
      background-color: #fff;
      padding: 3rem 0;
      margin-bottom: 3rem;
    }
    .description-box {
      background: #fff3e6;
      border: 1px solid #ffd9b3;
      padding: 1.5rem;
      border-radius: 5px;
      margin-bottom: 1.5rem;
      line-height: 1.8;
      min-height: 220px;
      width: 95%;
      margin: 0 auto 1.5rem auto;
    }
    .appointment-card {
      border: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    .appointment-card .card-body { padding: 2rem; }
    footer {
      background-color: #222;
      color: #bbb;
      padding: 2rem 0;
      text-align: center;
    }
    footer p { margin: 0; }
    [data-aos] {
      transition: transform 0.6s ease, opacity 0.6s ease;
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark" data-aos="fade-down">
    <div class="container">
      <a class="navbar-brand" href="#">${doctorDetails.name}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarMenu">
        <ul class="navbar-nav ms-auto">
          ${pageLinks.map(link => `
            <li class="nav-item">
              <a class="nav-link" href="/${link}">${link.replace('-', ' ')}</a>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <div class="hero-content" data-aos="zoom-in">
      <h1>Dr. ${doctorDetails.name}</h1>
      <p>Leading Specialist in ${websiteNiche}</p>
      <button class="btn btn-light mt-3" onclick="document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });">
        Book an Appointment
      </button>
    </div>
  </section>

  <!-- About Section -->
  <section class="container py-5">
    <div class="row">
      <!-- Left Column -->
      <div class="col-md-6" data-aos="fade-right">
        <h2>About Dr. ${doctorDetails.name}</h2>
        <p class="lead">Dedicated to offering the highest level of personalized care.</p>

        <!-- Specializations -->
        <h4>Specializations:</h4>
        <ul class="list-group list-group-flush mb-3">
          ${specializationList.map(spec => `
            <li class="list-group-item">
              <i class="bi bi-check-circle-fill"></i>
              ${spec}
            </li>
          `).join('')}
        </ul>

        <!-- Achievements -->
        <h4>Achievements:</h4>
        <ul class="list-group list-group-flush mb-3">
          ${achievementsList.map(ach => `
            <li class="list-group-item">
              <i class="bi bi-star-fill"></i>
              ${ach}
            </li>
          `).join('')}
        </ul>

        <!-- Description -->
        <h4 class="mb-2">Description:</h4>
        <div class="description-box">
          ${descriptionText}
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-md-6 text-center" data-aos="fade-left">
        <img src="${mainImage}" alt="Doctor" class="img-fluid rounded shadow">
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section" data-aos="fade-up">
    <div class="container">
      <h2>Experience Our World-Class Services</h2>
      <p class="mb-4">Book an appointment and discover the difference of dedicated, patient-centered care.</p>
      <button class="btn-cta" onclick="document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });">
        Book Now
      </button>
    </div>
  </section>

  <!-- Testimonial Carousel -->
  <section class="testimonial-carousel container py-5" data-aos="fade-up">
    <h2 class="text-center mb-4">What Our Patients Say</h2>
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <!-- Slide 1 -->
        <div class="carousel-item active">
          <div class="text-center">
            <img src="${t1}" alt="Patient 1">
            <blockquote class="blockquote mt-3">
              "Dr. ${doctorDetails.name} is simply the best. I felt cared for from the moment I walked in!"
            </blockquote>
            <p class="fw-bold">- Happy Patient</p>
          </div>
        </div>
        <!-- Slide 2 -->
        <div class="carousel-item">
          <div class="text-center">
            <img src="${t2}" alt="Patient 2">
            <blockquote class="blockquote mt-3">
              "I wouldn't trust anyone else with my family's needs."
            </blockquote>
            <p class="fw-bold">- Satisfied Family</p>
          </div>
        </div>
        <!-- Slide 3 -->
        <div class="carousel-item">
          <div class="text-center">
            <img src="${t3}" alt="Patient 3">
            <blockquote class="blockquote mt-3">
              "Professional, caring, and highly experienced. 10/10 recommend!"
            </blockquote>
            <p class="fw-bold">- Grateful Patient</p>
          </div>
        </div>
      </div>
      <!-- Controls -->
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="faq-section container" data-aos="fade-up">
    <h2 class="text-center mb-4">Frequently Asked Questions</h2>
    <div class="accordion" id="faqAccordion">
      ${faqs.map((faq, i) => `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${i}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
              ${faq.question}
            </button>
          </h2>
          <div id="collapse${i}" class="accordion-collapse collapse"
               data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              ${faq.answer}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Appointment Form -->
  <section class="contact-section" id="appointment">
    <div class="container" data-aos="fade-up">
      <h2 class="text-center mb-5">Request an Appointment</h2>
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card appointment-card">
            <div class="card-body">
              <h4 class="card-title mb-3">Please fill in your details</h4>
              <form>
                <div class="mb-3">
                  <label for="name" class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="name" placeholder="Your name" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input type="email" class="form-control" id="email" placeholder="name@example.com" required>
                </div>
                <div class="mb-3">
                  <label for="date" class="form-label">Preferred Date</label>
                  <input type="date" class="form-control" id="date" required>
                </div>
                <div class="mb-3">
                  <label for="notes" class="form-label">Additional Notes</label>
                  <textarea class="form-control" id="notes" rows="3" placeholder="Any special requests or questions..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary px-4">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p class="mb-2">&copy; ${new Date().getFullYear()} Dr. ${doctorDetails.name}. All rights reserved.</p>
      <p>Setting the gold standard in personalized healthcare.</p>
    </div>
  </footer>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <!-- AOS JS -->
  <script src="https://cdn.jsdelivr.net/npm/aos@2.3.1/dist/aos.js"></script>
  <script>
    AOS.init({ duration: 1000, once: true });
  </script>
</body>
</html>
  `;
}

// -----------------------------
// 4) Endpoint: JSON -> Netlify
// -----------------------------
app.post('/generate-landing-page', async (req, res) => {
  try {
    // 1) Generate the HTML in-memory
    const finalHtml = generateLandingPageHtml(req.body);

    // 2) Deploy that HTML to Netlify
    const deployUrl = await deployHtmlToNetlify(finalHtml);

    // 3) Return the Netlify URL
    return res.status(200).json({ success: true, netlifyUrl: deployUrl });
  } catch (err) {
    console.error('Error generating landing page or deploying:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// -----------------------------
// 5) Endpoint: NATLANG -> JSON -> Netlify
// -----------------------------
app.post('/nl-generate-landing-page', async (req, res) => {
  try {
    const { textPrompt } = req.body;
    if (!textPrompt) {
      return res.status(400).json({ error: 'Missing "textPrompt" field' });
    }

    // Build system instructions
    const systemMessage = 
`You are a helpful assistant that converts unstructured text into a JSON object 
with the following structure exactly:

{
  "websiteNiche": string, 
  "doctorDetails": {
    "name": string,
    "specialization": [array of strings],
    "achievements": [array of strings],
    "description": string
  },
  "pageLinks": [array of strings],
  "images": [array of strings],
  "testimonialImages": [array of strings],
  "faqs": [ { "question": string, "answer": string }, ... ]
}

Return ONLY valid JSON, with NO extra text or explanation.
If any field is missing from user prompt, guess or fill placeholders.
ALWAYS respond with valid JSON. No code blocks, no extra text.
`;

    const userMessage = `User prompt:\n${textPrompt}\n\nPlease extract into the required JSON.`;

    // 1) LLM call to parse
    const chatResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 0,
    });

    const rawAssistantReply = chatResponse.data.choices[0].message.content;

    // 2) Parse JSON from the LLM
    let parsed;
    try {
      parsed = JSON.parse(rawAssistantReply);
    } catch (e) {
      console.error("OpenAI JSON parse error:", e);
      return res.status(500).json({
        error: "LLM did not return valid JSON",
        raw: rawAssistantReply
      });
    }

    // 3) Generate the HTML from the parsed JSON
    const finalHtml = generateLandingPageHtml(parsed);

    // 4) Deploy to Netlify
    const deployUrl = await deployHtmlToNetlify(finalHtml);

    // 5) Respond with the Netlify link
    return res.status(200).json({ success: true, netlifyUrl: deployUrl });

  } catch (err) {
    console.error("Error in /nl-generate-landing-page:", err);
    return res.status(500).json({ error: 'Error processing natural language prompt' });
  }
});

// -----------------------------
// 6) Start the server
// -----------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Landing Page Generator is running at http://localhost:' + port);
});

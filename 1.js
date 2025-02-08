// server.js
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// ==========================
// 1. IMAGINARY IMAGE AGENT
// ==========================
async function getGeneratedImage(description) {
  // In a real app, you'd do an actual API call:
  // const response = await axios.post("https://my-imaginary-image-api.com/generate", { prompt: description });
  // return response.data.imageUrl;
  
  return `https://example.com/generated-image?prompt=${encodeURIComponent(description)}`;
}

// ==========================
// 2. TEMPLATES
// ==========================
/**
 * Basic template: Minimal styling with Bootstrap.
 */
function basicTemplate(niche, doctor, links, imageUrl) {
  const metaTitle = `Top ${doctor.specialization} – ${doctor.name} | ${niche} Expert`;
  const metaDescription = `${doctor.name} is a leading ${doctor.specialization}. ${doctor.achievements}.`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDescription}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Bootstrap CSS -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
  >
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">My ${niche} Site</a>
    </div>
  </nav>

  <div class="container my-4">
    <h1 class="mb-3">${doctor.name} – ${doctor.specialization}</h1>
    
    <div class="row">
      <div class="col-md-4">
        <img
          src="${imageUrl}"
          alt="Picture of ${doctor.name}"
          class="img-fluid rounded shadow"
        />
      </div>
      <div class="col-md-8">
        <p class="lead">
          ${doctor.name} is a highly respected ${doctor.specialization} in the ${niche} field.
        </p>
        <p>${doctor.achievements}.</p>
      </div>
    </div>

    <hr />

    <h2>Additional Info</h2>
    <ul>
      ${links.map(link => `<li><a href="/${link}">${link.replace('-', ' ')}</a></li>`).join('')}
    </ul>
  </div>

  <footer class="bg-light text-center py-3 mt-5">
    <p>&copy; ${new Date().getFullYear()} ${doctor.name}</p>
  </footer>

  <!-- Optional Bootstrap JS bundle -->
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js">
  </script>
</body>
</html>
  `;
}

/**
 * Fancy template: A step up with a hero, some custom styles, etc.
 */
function fancyTemplate(niche, doctor, links, imageUrl) {
  const metaTitle = `Premier ${doctor.specialization} – ${doctor.name} | ${niche.toUpperCase()} Excellence`;
  const metaDescription = `${doctor.name} is a top-rated ${doctor.specialization}. ${doctor.achievements}.`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDescription}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Bootstrap CSS -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
  >
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
    rel="stylesheet"
  >
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background-color: #f8f9fa; 
      color: #333;
    }
    .navbar-brand {
      font-weight: 600;
      font-size: 1.25rem;
    }
    .hero {
      background: linear-gradient(
                  rgba(0, 0, 0, 0.5),
                  rgba(0, 0, 0, 0.5)
                 ), 
                 url('${imageUrl}') center center/cover no-repeat;
      height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-shadow: 2px 2px 5px rgba(0,0,0,0.7);
    }
    .hero h1 {
      font-size: 3rem;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .hero p {
      font-size: 1.25rem;
      margin-top: 0.75rem;
    }
    .lead {
      font-weight: 400;
    }
    footer {
      background-color: #222;
      color: #bbb;
    }
    footer p {
      margin: 0;
    }
    .img-fluid.rounded.shadow {
      border: 2px solid #fff;
    }
  </style>
</head>
<body>
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid px-4">
      <a class="navbar-brand" href="/">${doctor.name} – ${doctor.specialization}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto">
          ${links.map(link => `
            <li class="nav-item">
              <a class="nav-link" href="/${link}">${link.replace('-', ' ')}</a>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="text-center">
      <h1>${doctor.name}</h1>
      <p class="lead">Expert in ${doctor.specialization}</p>
    </div>
  </section>

  <!-- Main Content -->
  <main class="container py-5">
    <div class="row mb-4">
      <!-- About -->
      <div class="col-md-6">
        <h2>About Dr. ${doctor.name}</h2>
        <p>
          ${doctor.name} is a renowned ${doctor.specialization} specializing in ${niche} care.
          ${doctor.achievements}.
        </p>
        <p class="lead">
          Dedicated to providing the highest quality of care for patients from all walks of life.
        </p>
      </div>
      <!-- Image -->
      <div class="col-md-6">
        <img
          src="${imageUrl}"
          alt="Portrait of ${doctor.name}"
          class="img-fluid rounded shadow"
        />
      </div>
    </div>

    <!-- Services & Links -->
    <h3 class="mb-3">Services & Helpful Links</h3>
    <div class="row">
      ${
        links.map(link => `
          <div class="col-md-3 mb-3">
            <div class="card">
              <div class="card-body text-center">
                <h5 class="card-title">${link.replace('-', ' ').toUpperCase()}</h5>
                <p class="card-text">
                  Learn more about our <strong>${link.replace('-', ' ')}</strong> here.
                </p>
                <a href="/${link}" class="btn btn-primary">Visit</a>
              </div>
            </div>
          </div>
        `).join('')
      }
    </div>
  </main>

  <!-- Footer -->
  <footer class="py-4 text-center">
    <div class="container">
      <p class="mb-1">&copy; ${new Date().getFullYear()} ${doctor.name}. All rights reserved.</p>
      <p>Providing excellence in ${doctor.specialization} for over 20 years.</p>
    </div>
  </footer>

  <!-- Optional Bootstrap JS bundle -->
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js">
  </script>
</body>
</html>
  `;
}

/**
 * Ultra fancy template: 
 * - Parallax hero with fixed background
 * - AOS scroll animations
 * - Testimonial carousel
 * - CTA (Book Appointment) section
 * - Contact form at bottom
 */
function ultraFancyTemplate(niche, doctor, links, imageUrl) {
  const metaTitle = `Luxury ${doctor.specialization} – ${doctor.name} | ${niche.toUpperCase()} Prestige`;
  const metaDescription = `${doctor.name} is a leading ${doctor.specialization} in the ${niche} field. ${doctor.achievements}.`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDescription}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Bootstrap 5 CSS -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
  >
  <!-- AOS (Animate On Scroll) CSS -->
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
      overflow-x: hidden; /* Hide horizontal scroll */
    }
    .navbar-brand {
      font-weight: 700;
    }
    .hero-section {
      position: relative;
      height: 75vh;
      background: url('${imageUrl}') center center / cover no-repeat fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-shadow: 2px 2px 6px rgba(0,0,0,0.5);
    }
    .hero-overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0,0,0,0.4);
    }
    .hero-content {
      position: relative;
      text-align: center;
      z-index: 2;
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
    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #15aabf, #2fbfac);
      color: #fff;
      padding: 3rem 0;
      text-align: center;
    }
    .cta-section h2 {
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .cta-section .btn-cta {
      background-color: #fff;
      color: #15aabf;
      font-weight: 600;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      transition: background-color 0.3s ease;
    }
    .cta-section .btn-cta:hover {
      background-color: #eee;
    }
    /* Testimonials */
    .testimonial-carousel .carousel-item {
      padding: 2rem;
    }
    .testimonial-carousel .carousel-item img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 50%;
    }
    .testimonial-carousel .carousel-item blockquote {
      font-style: italic;
      margin: 1.5rem 0;
    }
    /* Contact Form */
    .contact-section {
      background-color: #fff;
      padding: 3rem 0;
    }
    .contact-section h2 {
      font-weight: 700;
      margin-bottom: 1rem;
    }
    /* Footer */
    footer {
      background-color: #222;
      color: #bbb;
      padding: 2rem 0;
      text-align: center;
    }
    footer p {
      margin: 0;
    }
    /* AOS animations */
    [data-aos] {
      transition: transform 0.6s ease, opacity 0.6s ease;
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark" data-aos="fade-down">
    <div class="container">
      <a class="navbar-brand" href="#">${doctor.name} – ${doctor.specialization}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarMenu">
        <ul class="navbar-nav ms-auto">
          ${links.map(link => `
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
      <h1>${doctor.name}</h1>
      <p>Leading ${doctor.specialization} in ${niche}</p>
      <button class="btn btn-light mt-3" onclick="document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });">
        Book an Appointment
      </button>
    </div>
  </section>

  <!-- About Section -->
  <section class="container py-5">
    <div class="row">
      <div class="col-md-6" data-aos="fade-right">
        <h2>About Dr. ${doctor.name}</h2>
        <p>
          ${doctor.name} is a renowned ${doctor.specialization} specializing in ${niche} care.
          ${doctor.achievements}.
        </p>
        <p class="lead">
          Dedicated to offering the highest level of personalized care for every patient.
        </p>
      </div>
      <div class="col-md-6 text-center" data-aos="fade-left">
        <img src="${imageUrl}" alt="Photo of ${doctor.name}" class="img-fluid rounded shadow">
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section" data-aos="fade-up">
    <div class="container">
      <h2>Experience World-Class ${doctor.specialization} Today</h2>
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
            <img src="https://via.placeholder.com/80" alt="Patient 1">
            <blockquote class="blockquote mt-3">
              "Dr. ${doctor.name} is simply the best. I felt cared for from the moment I walked in!"
            </blockquote>
            <p class="fw-bold">- Happy Parent</p>
          </div>
        </div>
        <!-- Slide 2 -->
        <div class="carousel-item">
          <div class="text-center">
            <img src="https://via.placeholder.com/80" alt="Patient 2">
            <blockquote class="blockquote mt-3">
              "I wouldn't trust anyone else with my family's ${doctor.specialization} needs."
            </blockquote>
            <p class="fw-bold">- Satisfied Family</p>
          </div>
        </div>
        <!-- Slide 3 -->
        <div class="carousel-item">
          <div class="text-center">
            <img src="https://via.placeholder.com/80" alt="Patient 3">
            <blockquote class="blockquote mt-3">
              "Professional, caring, and highly experienced. 10/10 recommend!"
            </blockquote>
            <p class="fw-bold">- Grateful Patient</p>
          </div>
        </div>
      </div>
      <!-- Carousel Controls -->
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  </section>

  <!-- Appointment Form (Scroll Target) -->
  <section class="contact-section" id="appointment">
    <div class="container" data-aos="fade-up">
      <h2 class="text-center mb-5">Request an Appointment</h2>
      <div class="row justify-content-center">
        <div class="col-md-8">
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
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p class="mb-2">&copy; ${new Date().getFullYear()} ${doctor.name}. All rights reserved.</p>
      <p>Setting the gold standard in ${doctor.specialization} for patients in every walk of life.</p>
    </div>
  </footer>

  <!-- Bootstrap JS bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

  <!-- AOS Library JS -->
  <script src="https://cdn.jsdelivr.net/npm/aos@2.3.1/dist/aos.js"></script>
  <script>
    AOS.init({
      duration: 1000, // Animation duration
      once: true      // Whether animation should happen only once
    });
  </script>
</body>
</html>
  `;
}

// Map style strings to template functions
const templates = {
  basic: basicTemplate,
  fancy: fancyTemplate,
  ultraFancy: ultraFancyTemplate, // NEW "ultra fancy" version
};

// ==========================
// 3. MAIN ENDPOINT (POST)
// ==========================
app.post('/generate-landing-page', async (req, res) => {
  try {
    const {
      websiteNiche,
      doctorDetails,
      pageLinks = [],
      templateStyle = 'basic' // 'fancy' or 'ultraFancy' to pick the upscale versions
    } = req.body;

    if (!websiteNiche || !doctorDetails || !doctorDetails.name || !doctorDetails.specialization) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call the Imaginary Image Generator
    const promptDescription = `A professional photo of ${doctorDetails.name}, a ${doctorDetails.specialization} in the ${websiteNiche} niche`;
    const imageUrl = await getGeneratedImage(promptDescription);

    // Decide which template to use
    const templateFunc = templates[templateStyle] || templates['basic'];

    // Generate the HTML
    const htmlContent = templateFunc(websiteNiche, doctorDetails, pageLinks, imageUrl);

    // Return JSON containing the HTML
    res.status(200).type('text/plain').send(htmlContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ==========================
// 4. DEMO ENDPOINT (GET)
// ==========================
app.get('/test-landing-page', async (req, res) => {
  try {
    // Example data
    const websiteNiche = 'medical';
    const doctorDetails = {
      name: 'Dr. Jane Doe',
      specialization: 'Pediatrics',
      achievements: 'Over 20 years of experience, award-winning research in neonatal care',
    };
    const pageLinks = ['about-us', 'contact', 'services', 'blog'];

    // We'll use the "ultraFancy" template for demonstration
    const templateStyle = 'ultraFancy';

    // Get an image URL
    const promptDescription = `A professional photo of ${doctorDetails.name}, a ${doctorDetails.specialization} in the ${websiteNiche} niche`;
    const imageUrl = await getGeneratedImage(promptDescription);

    // Pick the template
    const templateFunc = templates[templateStyle];
    const htmlContent = templateFunc(websiteNiche, doctorDetails, pageLinks, imageUrl);

    // Serve the HTML
    res.type('html').send(htmlContent);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating test page');
  }
});

// ==========================
// 5. START THE SERVER
// ==========================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Landing Page Generator Agent is running at http://localhost:${port}`);
});

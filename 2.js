// server.js
const express = require('express');

const app = express();
app.use(express.json());

// ==========================
// 1. MAIN ENDPOINT (POST)
// ==========================
app.post('/generate-landing-page', (req, res) => {
  try {
    const {
      // 1) Basic fields
      websiteNiche,         // e.g. "medical"
      doctorDetails,        // e.g. { name: "Dr. daman Singh", specialization: "Neuro", achievements: "Has published 50+ research papers." }
      pageLinks = [],       // e.g. ["about-us", "services", "contact"]
      
      // 2) Images array; we’ll use images[0] in two places (hero & about image)
      images = []
    } = req.body;
    
    // Validation
    if (!websiteNiche || !doctorDetails || !doctorDetails.name || !doctorDetails.specialization) {
      return res.status(400).send('Missing required fields');
    }
    
    // We'll grab the first image from images[], or fall back to a "no image" placeholder.
    const mainImage = images.length > 0
      ? images[0]
      : 'https://via.placeholder.com/1200x600?text=No+Hero+Image';
    
    // Build the final HTML (as per your snippet).
    // The hero background and the "about" image both point to mainImage
    // The rest (testimonial images) are placeholders, just like your snippet.
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Luxury ${doctorDetails.specialization} – ${doctorDetails.name} | ${websiteNiche.toUpperCase()} Prestige</title>
  <meta name="description" content="${doctorDetails.name} is a leading ${doctorDetails.specialization} in the ${websiteNiche} field. ${doctorDetails.achievements}" />
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
      background: url('${mainImage}') center center / cover no-repeat fixed;
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
      <a class="navbar-brand" href="#">${doctorDetails.name} – ${doctorDetails.specialization}</a>
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
      <h1>${doctorDetails.name}</h1>
      <p>Leading ${doctorDetails.specialization} in ${websiteNiche}</p>
      <button class="btn btn-light mt-3" onclick="document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });">
        Book an Appointment
      </button>
    </div>
  </section>

  <!-- About Section -->
  <section class="container py-5">
    <div class="row">
      <div class="col-md-6" data-aos="fade-right">
        <h2>About Dr. ${doctorDetails.name}</h2>
        <p>
          ${doctorDetails.name} is a renowned ${doctorDetails.specialization} specializing in ${websiteNiche} care.
          ${doctorDetails.achievements}
        </p>
        <p class="lead">
          Dedicated to offering the highest level of personalized care for every patient.
        </p>
      </div>
      <div class="col-md-6 text-center" data-aos="fade-left">
        <img src="${mainImage}" alt="Photo of ${doctorDetails.name}" class="img-fluid rounded shadow">
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section" data-aos="fade-up">
    <div class="container">
      <h2>Experience World-Class ${doctorDetails.specialization} Today</h2>
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
              "Dr. ${doctorDetails.name} is simply the best. I felt cared for from the moment I walked in!"
            </blockquote>
            <p class="fw-bold">- Happy Parent</p>
          </div>
        </div>
        <!-- Slide 2 -->
        <div class="carousel-item">
          <div class="text-center">
            <img src="https://via.placeholder.com/80" alt="Patient 2">
            <blockquote class="blockquote mt-3">
              "I wouldn't trust anyone else with my family's ${doctorDetails.specialization} needs."
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
      <p class="mb-2">&copy; ${new Date().getFullYear()} ${doctorDetails.name}. All rights reserved.</p>
      <p>Setting the gold standard in ${doctorDetails.specialization} for patients in every walk of life.</p>
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

    // Return as text/html so it looks the same when you open it in a browser
    return res.status(200).type('text/html').send(htmlContent);
  } catch (err) {
    console.error('Error generating landing page:', err);
    return res.status(500).send('Something went wrong');
  }
});

// ==========================
// 2. START THE SERVER
// ==========================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Landing Page Generator is running at http://localhost:${port}`);
});

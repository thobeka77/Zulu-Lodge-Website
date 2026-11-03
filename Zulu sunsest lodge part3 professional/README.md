# Zulu Sunset Lodge — Part 3: Enhancing Functionality and SEO

## Project overview
A responsive multi-page website concept for Zulu Sunset Lodge. This Part 3 update builds on the existing Part 2 HTML/CSS project and keeps the supplied lodge images and visual identity.

## Pages
- `index.html` — home page
- `about.html` — about the lodge
- `rooms.html` — accommodation cards with client-side search and sorting
- `services.html` — services and interactive FAQ accordion
- `dining.html` — dining information
- `events.html` — weddings and events
- `gallery.html` — image gallery with accessible lightbox
- `booking.html` — booking details and estimated total
- `payment.html` — demonstration-only payment step
- `confirmation.html` — locally stored demo booking summary
- `enquiry.html` — service, accommodation, event, volunteer and sponsorship enquiries
- `contact.html` — general contact form and general-area map

## Part 3 functionality implemented
### JavaScript and interactive elements
- Responsive mobile navigation toggle with `aria-expanded`, active-page indication and a skip-to-content link.
- Accommodation search and sorting by price or name.
- Gallery lightbox with previous/next controls, Escape-to-close and arrow-key navigation.
- Expandable FAQ accordion using native accessible `<details>` and `<summary>` elements.
- Scroll reveal effects that respect the user's reduced-motion preference.
- Booking summary and estimated price calculation based on accommodation and number of nights.
- Form validation using HTML constraints and JavaScript before preparing a `mailto:` email.

### Form requirements
- `enquiry.html` lets visitors choose an enquiry type (accommodation, services, events, volunteering, sponsorship or other), add contact details, a preferred date and a message.
- `contact.html` provides a separate general-contact form requesting basic contact information, message topic and a full message.
- Both forms validate required fields, email format, message length and optional phone format.
- The JavaScript includes an asynchronous `fetch()`/AJAX submission branch. To enable it, set `FORM_ENDPOINT` inside `setupValidatedEmailForms()` to a real endpoint from a configured form service; test success and failure states before assessment. The endpoint is intentionally blank until you choose and configure a provider.
- The forms open the user's default email app with a prepared message. A static front-end cannot deliver email silently by itself. For true server-side/AJAX submission, connect a trusted form service or build a secure backend and update the README with the actual service used.

### SEO and accessibility
- Page-specific title tags and meta descriptions.
- Semantic landmarks, descriptive image alternative text where supplied, responsive viewport, lazy-loaded gallery images, skip link and keyboard focus styling.
- `robots.txt` and `sitemap.xml` starter files.
- Mobile-friendly layout and reduced-motion support.

## How to run and test locally
1. Extract this ZIP file.
2. Open the `Zulu sunsest lodge` folder in Visual Studio Code.
3. Open `index.html` in a browser, or run it with the Live Server extension.
4. Test each navigation link on desktop and mobile widths.
5. On `rooms.html`, search for `garden` or `pool`, then try each sort option.
6. On `gallery.html`, open an image, test next/previous, arrow keys and Escape.
7. On `services.html`, expand and collapse the FAQ items.
8. On `booking.html`, test required fields, check-in/check-out order, guest count, nights and the estimated total.
9. On `enquiry.html` and `contact.html`, submit empty and invalid forms first, then valid data. Confirm that a prepared email opens in your mail application.
10. Confirm the payment and confirmation pages clearly remain demo-only and do not process real payments.

## GitHub commit workflow
From the project folder, use:
```bash
git status
git add .
git commit -m "Add Part 3 JavaScript functionality and SEO"
git push
```
Use separate, descriptive commits if your lecturer expects evidence of progress. Do not claim a commit was made unless it appears in your Git history.

## Deployment checklist (GitHub Pages or Netlify)
- Push the project to your own GitHub repository.
- Deploy the folder containing `index.html` and the other HTML files.
- Replace `YOUR-DOMAIN.example` in `robots.txt` and `sitemap.xml` with the actual published domain.
- Test all pages and image paths on the live site, including mobile navigation.
- If using a real form service, configure it securely and test successful/failed submission states.
- Do not publish real payment collection without a compliant payment provider and secure backend.

## Changelog
### Part 3 — Enhancing Functionality and SEO
- Updated all page navigation to a consistent menu with Booking and Enquiry links; added mobile toggle, current-page indication and accessibility attributes.
- Added page-specific SEO titles/descriptions, skip links, focus states and responsive/reduced-motion improvements.
- Added dynamic accommodation search and sorting.
- Added an accessible gallery lightbox with keyboard controls.
- Added an interactive FAQ accordion and a general-area interactive map embed on the contact page.
- Created a dedicated enquiry form and added a separate general-contact form with client-side validation and prepared email workflow.
- Improved booking date validation, night calculation, summary and demonstration payment wording.
- Added `robots.txt` and `sitemap.xml` templates and deployment/testing instructions.

## Known limitations / honest project notes
- This is a front-end educational demonstration. Booking data is saved in the visitor's browser and is not sent to a lodge database.
- The payment flow is not connected to a payment gateway and must not be described as a real payment.
- `mailto:` depends on the visitor having an email application configured. AJAX submission is included but is inactive until a real form-service endpoint is configured.
- The map identifies the general KwaZulu-Natal North Coast area, not a verified street address.
- Replace the example sitemap/robots domain after deployment.
- This package does not include GitHub commits or live deployment; those steps must be performed in your own account.

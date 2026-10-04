# Tamyr — Clothing Store

Tamyr is a responsive clothing store website created for the Web Technologies midterm project at Astana IT University. The concept combines everyday fashion with Kazakh-inspired ornaments and ethnic details.

## Team

Group: **SE-2524**

- Yernur Alimbekov
- Ulzhan Musakhan
- Assel Yermekkyzy

## Links

- Website: https://qoshima.github.io/project-clothing-store/
- Repository: https://github.com/Qoshima/project-clothing-store

## Pages

| Page | Description |
| --- | --- |
| Home (`index.html`) | Brand introduction, collection images and shopping links. |
| Catalog (`products.html`) | Women's and men's collections with six products in each section, images, descriptions and prices. |
| About (`about.html`) | The brand's story, values and inspiration. |
| Size Guide (`size-guide.html`) | Women's and men's size tables and instructions for taking measurements. |
| Contact (`contact.html`) | Contact form, contact details and frequently asked questions. |
| Account (`account.html`) | Demo sign-in and registration forms. |
| Checkout (`checkout.html`) | Contact and shipping fields with a sample order summary. |

## Features

- Shared header, navigation and footer across all seven pages.
- Catalog sidebar and anchor links to the women's and men's collections.
- Responsive product cards with hover effects and positioned New badges.
- Size tables switched using radio buttons and CSS, without JavaScript.
- Measurement diagram with written instructions.
- Forms with labels, appropriate input types and required fields.
- Expandable registration section using the HTML `details` and `summary` elements.
- Consistent colors, typography and spacing across the website.

## Technologies and Layout

- **HTML5:** semantic elements including `header`, `nav`, `main`, `section`, `article`, `aside` and `footer`; tables and forms.
- **CSS3:** shared styles in `styles.css` and separate stylesheets for individual pages.
- **Flexbox:** navigation, product card content and other aligned groups of elements.
- **CSS Grid:** page layouts, including the catalog sidebar and checkout columns.
- **Positioning:** relative positioning for product image containers and absolute positioning for New badges.
- **Bootstrap 5.3.8:** grid classes such as `row`, `col-12`, `col-sm-6` and `col-lg-4`, plus utilities such as `text-center`, `mb-5`, `mb-3` and `mx-auto`.
- **Google Fonts:** Inter and Isometra.
- **GitHub Pages:** website hosting.

## Responsive Design

Media queries at **992px** and **576px** adapt the layouts for smaller screens. The Account page also uses a **768px** breakpoint. Navigation wraps, multi-column sections stack, and spacing adjusts as the screen becomes narrower.

The catalog uses Bootstrap columns to display one product per row on small phones, two from 576px, and three from 992px.

## Running Locally

1. Download the repository ZIP and extract it, or clone the repository.
2. Open `index.html` in a web browser. Alternatively, open the project in VS Code or WebStorm and use a local preview server.
3. Keep the existing folder structure so image and stylesheet paths continue to work.

No installation or build step is required. An internet connection is needed to load Bootstrap and Google Fonts from their CDNs.

## Demo Limitations

This is a static frontend project built with HTML and CSS. It has no backend, database or JavaScript application logic. Contact messages are not delivered, accounts are not created, and orders or payments are not processed. Checkout displays a fixed sample item rather than a working shopping cart. Products and prices are demonstration content.

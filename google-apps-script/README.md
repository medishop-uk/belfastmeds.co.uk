# BelfastMeds orders and reviews API

The Apps Script is designed for the belfastmeds-data spreadsheet and these exact tabs:

- orders
- reviews-ratings

## Deployment

1. Open the belfastmeds-data Google Sheet.
2. Open Extensions, then Apps Script.
3. Replace the editor content with reviews.gs.
4. Run setup once and approve the requested spreadsheet permissions.
5. Choose Deploy, New deployment, Web app.
6. Set Execute as to yourself and choose the audience allowed to access the web app.
7. Copy the deployed URL ending in /exec.
8. Paste that URL into assets/js/config.js as BELFASTMEDS_DATA_API.
9. Deploy the website.

## Data flow

- A basket request is written to orders before the customer is redirected to WhatsApp or Telegram.
- Duplicate order IDs are ignored.
- New reviews are written to reviews-ratings with Pending status.
- Only Approved reviews are returned publicly.
- Reviewer email addresses are never returned by the public endpoint.

## Management

Use these values in the orders status column:
New, Contacted, Confirmed, Completed, Cancelled.

Use these values in the reviews-ratings status column:
Pending, Approved, Rejected.

After changing Apps Script code, create a new deployment version or edit the active deployment to use the new version.

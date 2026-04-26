# LvlUp Labs CMS

LvlUp Labs CMS is a Rails-based CMS and directory starter for building farm, listing, and media-heavy content sites with an admin-first workflow. It uses Next.js,  ORM, PostgreSQL, and Tailwind to give you a modern CMS foundation with a clean back office.

## What it includes

- Next.js 15 app with PostgreSQL (via ).
- Custom Admin Dashboard for CRUD.
- S3-Compatible Storage for images and uploads.
- Rich text content support.
- Farm listings with photos, SEO fields, and publication status.

## Getting started

```bash
npm install
npm run dev
```

## Stack

- Next.js (App Router).
- PostgreSQL.
-  ORM.
- Firebase Auth / Admin SDK.
- S3-Compatible Storage.
- Tailwind CSS.

## Main models

- `User`: site users and farm owners.
- `AdminUser`: admin dashboard logins.
- `Farm`: main listing record.
- `Photo`: farm image records.
- `Category`: taxonomy for filtering.
- `FarmCategory`: join table for categories.

## Admin workflow

The admin panel is designed for managing farms, uploading photos, editing rich text content, and controlling publication state from a single interface. The `Farm` admin resource includes content, location, media, and SEO sections for a CMS-style editing experience.

## Development notes

- Use a slug for each farm listing.
- Store the hero image with S3-compatible storage.
- Use nested photos for gallery management.
- Keep the first release focused on CRUD, publishing, and search.

## License

Add your project license here.

## Roadmap

- Public farm directory.
- Search and filtering.
- Category pages.
- Image optimization.
- Scheduled publishing.
- Role-based admin access.

## Project purpose

LvlUp Labs CMS is meant to speed up the launch of a polished directory-style site without building the admin system from scratch.

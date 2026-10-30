# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks and no build step: files are opened directly in a browser.

## Project Structure

- `index.html`: the single page; every lesson is a `<section>` inside `<main>`
- `css/styles.css`: styles, including the light and dark theme colors
- `js/main.js`: lesson switching (one section shown at a time) and the theme toggle
- The original slide deck is not stored in the repository.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Feature Plan

### Site structure

One page, with one lesson section shown at a time (JavaScript switches
between them; there are no separate pages):

1. Header: course title and theme toggle
2. Lessons: one section per slide, in the deck's order, except that the
   two identical title slides are one Welcome section and the Learning
   Objective comes right after it
3. Discussion slides become a question with a "Show a sample answer" reveal

How students move around:
- A lesson list at the top to jump to any lesson
- Previous and Next buttons below the lesson
- The address ends in `#lesson-id`, so a lesson can be linked to directly

### Phases

**Phase 1: the course built from my slides**
- Get the slides (PDF or PowerPoint) from the user before building
- Agree the lesson outline and quiz questions, then build the page
- Friendly, colorful look; light theme by default with a dark toggle;
  works on desktop, tablet, and phone

**Phase 2: polish**
- To be decided after Phase 1 (for example a progress indicator)

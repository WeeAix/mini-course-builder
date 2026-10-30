# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks and no build step: files are opened directly in a browser.

## Project Structure

The repository is nearly empty for now; it only contains `README.md`.
As files are added, keep them at the top level or in simple folders
(for example `css/`, `js/`) and update this section.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Feature Plan

### Site structure

One long scrolling page, in this order:

1. Header: course title and theme toggle
2. Intro: who it's for and what students will learn
3. Lessons: one section per slide (3-5), each with the slide's content,
   any slide image, and a short quiz
4. Recap: the key ideas in a few lines

How students move around:
- Scroll down through the lessons in order
- A sticky top bar with jump links to each lesson
- A "Next lesson" link at the end of each lesson

### Phases

**Phase 1: the course built from my slides**
- Get the slides (PDF or PowerPoint) from the user before building
- Agree the lesson outline and quiz questions, then build the page
- Friendly, colorful look; light theme by default with a dark toggle;
  works on desktop, tablet, and phone

**Phase 2: polish**
- To be decided after Phase 1 (for example a progress indicator)

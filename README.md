# SmartNoteShare

_A smart note sharing platform built on NodeJS and uses LLM with transfer learning to summarize texts in the uploaded notes._

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Workflow](#workflow)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

**SmartNoteShare** is a collaborative platform for sharing notes enhanced by artificial intelligence. It leverages advanced language models (LLMs) with transfer learning to automatically summarize the content of uploaded notes, making it easier and faster for users to review and digest information.

## Features

- **Upload & Share Notes:** Easily upload your notes and share them with others.
- **AI Summarization:** Automatic summarization of notes using LLM and transfer learning.
- **Smart Search:** Find notes efficiently using intelligent search (potential or existing).
- **User Authentication:** Secure sign-up and login system.
- **Rich Interface:** Clean and interactive UI using EJS templates and styled with CSS.
- **Collaborative Learning:** Share and discuss notes to foster a community of learners.
   

## Tech Stack

- **Backend:** [Node.js](https://nodejs.org/)
- **Frontend Templating:** [EJS](https://ejs.co/)
- **Styling:** CSS
- **AI/ML:** T5-large
- **Database:** PostgreSQL

**Language Composition:**

- JavaScript: 44.1%
- EJS: 41.9%
- CSS: 14%

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/godsneverdie/SmartNoteShare.git
cd SmartNoteShare

```

2. **Install dependencies:**

```bash
npm install

```

3. **Configure Environment:**

   - Create a `.env` file based on `.env.example` if present.
   - Add necessary configuration such as database URL, AI API keys, etc.

4. **Start the Application:**

```bash
npm start

```

or

```bash
node app.js

```

5. **Open in your browser:**

```sh
http://localhost:3000

```

## Workflow

The SmartNoteShare workflow ensures seamless note sharing and intelligent summarization:

1. **User Registration/Login:**  
   Users sign up or log in to access the platform. Authentication keeps user data secure.
2. **Note Upload:**  
   Users upload their notes in supported formats via the intuitive dashboard.
3. **Automatic Summarization:**  
   When a note is uploaded, the platform leverages an integrated Large Language Model (LLM) with transfer learning to analyze and generate a concise summary of the note’s content.
4. **Note Management:**  
   Uploaded notes, along with their AI-generated summaries, are stored in each user’s profile for easy access and management.
5. **Sharing & Collaboration:**  
   Users can share notes publicly or with specific peers, allowing for collaborative learning and knowledge exchange.
6. **Search & Discovery:**  
   The intelligent search system (current or planned) enables users to find notes and summaries quickly based on keywords or topics.
7. **Viewing & Discussion:**  
   Other users can view shared notes, read their summaries, and participate in discussions to clarify and expand on the content.
   <div align="center">
```mermaid 
   graph TD
   A[User uploads note] --> B[Node.js Backend receives note]
   B --> C[Store note in database]
   C --> D[Text extracted from document]
   D --> E[LLM gets the text]
   E --> F[Generate summary]
   F --> G[Store summary]
   G --> H[Display summary to user]
   H --> I[User shares summarized note]
   ```
   </div>

This workflow aims to enhance knowledge sharing by making large amounts of textual information more accessible and manageable for everyone.

## Usage

- Register or log in to your account.
- Upload notes via the dashboard.
- View AI-generated summaries alongside the full notes.

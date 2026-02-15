Echo-Audit 🎯
Basic Details

Team Name: [PooThiri]

Team Members

Member 1: [Anagha JM] – [Saintgits Collage of Engineering]

Member 2: [Diya Ann John] – [Saintgits Collage of Engineering]

Hosted Project Link

[Add your hosted project link here]

Project Description

Echo-Audit is a browser extension that analyzes a website’s Terms of Service in real time. It detects policy changes, scans for risky clauses, and summarizes key concerns in simple language for users.

The Problem Statement

Users blindly accept Terms & Conditions without understanding hidden clauses about data usage, liability, or permissions. This leads to privacy risks and uninformed consent.

The Solution

Echo-Audit automatically scans ToS pages, compares them with previous versions, identifies risky keywords, and generates a simplified summary using AI so users instantly know what they’re agreeing to.

Technical Details
Technologies/Components Used
For Software:

Languages used: JavaScript, HTML, CSS

Frameworks used: None (Vanilla JS for lightweight performance)

Libraries used: Chrome Extension APIs

Tools used: VS Code, Git, Chrome Developer Tools

For Hardware:

Not applicable.

Features

Feature 1: Detects active website domain automatically

Feature 2: Compares current Terms with stored baseline version

Feature 3: Identifies risky keywords (data sharing, AI training, etc.)

Feature 4: Generates readable summary of important clauses

Implementation
For Software:
Installation
git clone <repo-url>
cd echo-audit


Load extension:

Chrome → Extensions → Load unpacked → Select project folder

Run

No build required.
Open any website → click extension icon → see audit report.

Project Documentation
Screenshots

![![alt text](image.png)](Add screenshot 1 here)
Popup report showing detected risks and summary

![![alt text](image-1.png)](Add screenshot 2 here)
Domain detection and change status indicator

![![alt text](image-2.png)](Add screenshot 3 here)
Keyword detection results

Diagrams
System Architecture

Browser → Content Script → Background Script → Logic Modules → Popup UI

Architecture Diagram: Shows interaction between browser tab, extension scripts, keyword scanner, and UI renderer.

Application Workflow

User opens site → Extension detects domain → Extracts ToS text → Compares baseline → Scans risks → Generates summary → Displays popup report

Workflow Caption: Flow of data through system.

Additional Documentation
API Documentation

(Base URL only required if you deploy backend API)

Base URL:

https://api.yourproject.com


Endpoints:

GET /scan

Description: Scans ToS text and returns risk analysis

Response:

{
  "status": "success",
  "data": {
    "risks": [],
    "severity": "Low"
  }
}




What video demonstrates

Extension scanning

Risk detection

Summary generation

Live example usage

Additional Demos

[Optional links — [live demo, recorded demo, etc.](https://drive.google.com/file/d/17zX9Fqp4cItFdGKjPG9hqfKFjv8yMlLj/view?usp=drive_link)]

AI Tools Used (Transparency Section)

Tool Used: ChatGPT
Purpose:

Debugging logic

Generating boilerplate code

Architecture planning

Key Prompts Used

“Generate Chrome extension architecture”

“Fix async message passing”

“Detect keywords from text”

Estimated AI-generated code: ~30–40%

Human Contributions

Logic design

UI layout

Feature implementation

Integration testing

Team Contributions

[Diya Ann John] — Core logic development, keyword scanner, architecture

[Anagha JM] — UI design, extension integration, testing

License
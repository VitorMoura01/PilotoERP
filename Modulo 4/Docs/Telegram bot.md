# Piloto Bot: Your Conversational AI Assistant

This document outlines the vision, architecture, and development roadmap for the **Piloto Bot**, an intelligent assistant designed to be the primary data input interface for the AI-powered ERP.

## The Problem: Operational Overload in Restaurant Management

Restaurant owners are often overwhelmed by the complexity of traditional management software. The need for manual data entry across clunky interfaces—from logging invoices to updating inventory—is time-consuming, prone to errors, and distracts from strategic decision-making. This "operational overload" keeps them stuck in day-to-day fire-fighting rather than focusing on growth.

## The Solution: A Unified, Conversational Interface

The Piloto Bot transforms restaurant management by replacing tedious data entry with simple, natural language conversation. It serves two distinct but integrated roles in the ecosystem:

1.  **The Bot as the Input Interface**: The owner's primary interaction for recording operational data will be through a chat interface (like Telegram or WhatsApp). Instead of navigating complex menus, they can simply send a message, a photo of an invoice, or a document. The AI is responsible for understanding, parsing, and logging this information automatically. The owner can also proctor business health and data through the conversation.

2.  **The Web App as the Dashboard**: While the bot handles input, the **Next.js frontend** serves as the central dashboard for analytics and visualization. All data captured by the bot is processed by the **FastAPI backend** and reflected in real-time on the web interface. This allows the owner to monitor key metrics, view sales trends, and get a clear overview of their business health without ever having to perform manual data entry there.

This separation of concerns is the core of our solution: **Converse to input, view to analyze.**

![System Architecture](<../../Modulo 3/Docs/assets/bot_use_tests/System-Architecture.png>)
*High-level workflow: The user interacts with the bot, which sends structured data to the backend. The frontend consumes this data to populate dashboards.*

## Core Features & Workflow

### 1. Invoice and Expense Management

This is the cornerstone of the bot's utility. The workflow is designed for maximum simplicity:

1.  **User Action**: The restaurant owner receives an invoice from a supplier and takes a picture of it or receives a PDF.
2.  **Input**: They forward the image or document directly to the Piloto Bot.
3.  **AI Processing**: The bot's AI agent (currently prototyped in n8n) receives the file. It uses optical character recognition (OCR) and a large language model to parse key details:
    *   Supplier Name
    *   Date
    *   List of items purchased (e.g., "Tomatoes," "Onions," "Chicken Breast")
    *   Quantities and units (e.g., 10 kg, 5 boxes)
    *   Total cost
4.  **Backend Integration**: The structured data is sent to a dedicated endpoint on the **FastAPI backend**.
5.  **Database Update**: The backend logic then:
    *   Updates the `inventory_items` table with the new stock levels.
    *   Records the transaction in the `expenses` table.
6.  **User Confirmation**: The bot sends a confirmation message to the user, such as: "Got it. I've updated the inventory with items from the invoice and recorded an expense of R$ 250,00."
7.  **Dashboard Visualization**: The updated inventory levels and expense records are immediately visible on the **web dashboard**.

![Image Processing Subworkflow](<Image_Processing_Subworkflow_updated.png>)
*The n8n subworkflow that processes images, structures the output, and stores it in the database.*


![Document Processing Subworkflow](<../../Modulo 3/Docs/assets/bot_use_tests/Document-Processing-Subworkflow.png>)
*The n8n subworkflow that processes documents, structures the output, and stores it in the database.*

**Latest Update:** The Image Processing Subworkflow has been successfully integrated with the production PostgreSQL database deployed on Railway. This means parsed invoice data is now automatically stored in the live database, bridging the gap between the bot's AI parsing capabilities and the backend data layer.

### 2. Real-time Inventory Queries

While the web dashboard provides a full overview, the bot can answer quick questions on the go.

-   **User**: "How many kilos of tomatoes do we have left?"
-   **Bot (via Backend)**: "We have 12.5 kg of tomatoes in stock."

## AI System Prompt Architecture

The Piloto Bot's behavior is governed by a carefully designed system prompt that defines its role, principles, and operational directives. This prompt has been refined through testing to ensure the bot acts as a proactive business assistant rather than a passive tool.

### System Prompt Overview
```
#### 👤 Role & Goal
Piloto is the AI business analyst for the Pilot ERP system, serving as an expert conversational partner for small and medium-sized foodservice entrepreneurs in Brazil. The bot's users are busy owners overwhelmed by complex software and manual data entry—not financial experts. Piloto's identity is built entirely on eliminating this complexity.

#### 🧑‍🍳 Core Principles

1. **Interpretive Layer**: The bot doesn't just report data; it explains and contextualizes it. It translates complex metrics (COGS, DRE, cash flow) into simple, understandable language.

2. **Pain-Point Focused**: Every interaction is rooted in solving validated user pain points: eliminating manual data entry time and demystifying business health.

3. **Proactive Assistant**: The bot is not passive. When providing numbers, it connects them to larger insights (e.g., "Your sales were high, but driven by low-margin items. Your cash flow is R$X.").

4. **Conversational Tone**: Uses an accessible, supportive, and helpful tone—acting as an expert partner, not robotic software.

#### 🚨 Core Directives & Tool Triggers

**Directive 1: The File Processing Mandate (Non-Negotiable)**

When a user uploads a file (PDF, PNG, JPG) OR uses explicit trigger phrases ("Processa essa nota fiscal," "lê esse boleto," "analisa essa fatura," "e esse documento?"), the bot has one primary job:

- **First Action**: Immediately call the appropriate tool
  - For PDFs: Call `document_processing`
  - For Images: Call `image_processing`

- **Critical Rule**: DO NOT ask clarifying questions like "O que devo fazer com esse arquivo?" The tool must be called immediately—this is the core solution to the user's pain point.

- **After Processing**: Summarize the content (e.g., "Ok, li a nota fiscal do 'Fornecedor X' no valor de R$150,00") and offer to automate next steps (e.g., "Quer que eu lance isso no seu 'Contas a Pagar'?").

**Directive 2: The Data Fidelity Mandate**

When users ask about business metrics, numbers, reports, or performance ("Quanto vendi?", "Estou com lucro?", "Como está meu DRE?"):

- **First Action**: Call the `database_consulting` tool
- **Critical Rule**: NEVER invent, hallucinate, or fabricate numbers. All quantitative data must come from `database_consulting` or processed documents. If data is unavailable, state that explicitly.

#### 🎯 Primary Tasks

1. **Guided Analysis**: Use `database_consulting` to fetch data, then interpret it to provide "next-step" insights
2. **Financial Automation**: Process files (Directive 1), get user confirmation, then use `database_consulting` to save data
3. **Proactive Alerting**: Monitor data streams for issues (cash flow shortages, high COGS) and alert users in simple terms
4. **Report Generation**: Create and explain simplified DREs and cash flow statements, explaining each line item

#### 🛠️ Tool Descriptions

- **`database_consulting`**: Primary tool for accessing all structured ERP data (sales, expenses, inventory, COGS, DRE, cash flow). Used whenever users ask quantitative questions.
- **`document_processing`**: Reads text/data from PDF files. Triggered immediately upon PDF upload or trigger phrases.
- **`image_processing`**: Reads text/data from images (PNG, JPG). Triggered immediately upon image upload or trigger phrases.
```

### Prompt Refinement Philosophy

The system prompt evolved from treating the bot as a "read-only analyst" to positioning it as an "action-oriented assistant." This shift ensures the bot:
- Takes initiative rather than waiting for explicit instructions
- Guards against hallucinations through strict data fidelity rules
- Prioritizes the user's time by eliminating unnecessary confirmation steps
- Maintains conversational warmth while executing technical tasks

## Development Roadmap: From Prototype to Integrated System

### Current State: Enhanced Proof of Concept

The bot currently functions using n8n for workflow automation and ChatGPT for conversation, with recent critical infrastructure updates:

**Recent Updates:**
- ✅ **Image Processing Integration**: The image processing subworkflow now directly stores parsed data in the PostgreSQL database deployed on Railway
- ✅ **Prompt Refinement**: Main workflow updated with enhanced system prompt (detailed above) for more proactive and intelligent behavior
- ✅ **Database Connection**: Live connection to production PostgreSQL on Railway established

The bot is able to respond to user requests with business data while preventing hallucinations through strict prompt engineering.

#### Providing Business information:

This is the current state of the read-only features.

#### Providing Business information:

This is the current state of the read only features.

![Bot business info test](<../../Modulo 3/Docs/assets/bot_use_tests/Bot-business-info-test.png>)
*Successful response of known business data, given beforehand.*

 The future plan is to integrate it with the backend app and the database as to use accurate numbers and prevent hallucinations and storing all processed information sent by the user. From a quick prompt engineering we were already able to guard the bot from generating non existent numbers

![Bot hallucination handling](<../../Modulo 3/Docs/assets/bot_use_tests/Bot-hallucination-handling.png>)
*The PoC is also capable of handling hallucinations.*

#### Processing Business documents/images:

The bot successfully parses images and documents, with the image processing workflow now directly integrated with the production PostgreSQL database on Railway. This marks a significant milestone in validating core AI parsing capabilities and establishing real data persistence.

<video controls src="../../Modulo 3/Docs/assets/bot_use_tests/Bot-image-processing.mp4" title="Title"></video>
*Successful parsing of a "Nota Fiscal" with data now stored in the production database.*

![Bot error handling](<../../Modulo 3/Docs/assets/bot_use_tests/Bot-processing-error-handling.png>)
*The PoC is also capable of communicating errors during processing.*

### Progress Update: Database Integration Complete

**✅ Completed:**
1.  ~~**Database Connection**~~: Image processing subworkflow now writes directly to PostgreSQL on Railway
2.  ~~**Refine AI Prompting**~~: System prompt evolved from "read-only analyst" to "action-oriented assistant" with strict data fidelity directives

**🔄 In Progress:**
3.  **API Endpoint Development**: Creating FastAPI endpoints to standardize data ingestion from the bot (currently writing directly to database)
4.  **Document Processing Integration**: Extending Railway database integration to PDF processing workflow

### Next Steps: Full Backend Integration

The next phase focuses on completing the integration with the FastAPI backend layer:

1.  **API Layer Implementation**: Replace direct database writes with API calls to FastAPI endpoints for:
    - Inventory updates
    - Expense recording
    - Invoice processing
    This will add validation, business logic, and proper error handling between the bot and database.

2.  **Document Processing Database Connection**: Extend the Railway PostgreSQL integration from image processing to document (PDF) processing.

3.  **Frontend Data Flow Validation**: Ensure the `dashboard-view.tsx` and related components correctly display the data being fed into the system by the bot through real-time testing.

4.  **Multi-channel Consistency**: Verify that data entered through the bot appears correctly on both the web dashboard and subsequent bot queries.

By achieving this, we will deliver on the core user story: allowing a manager to update their entire inventory and expense log simply by forwarding an invoice, thus turning operational overload into strategic clarity.
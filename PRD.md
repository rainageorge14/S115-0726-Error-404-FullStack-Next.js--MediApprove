# Product Requirements Document (PRD) — MediApprove

This document outlines the Product Requirements for **MediApprove**, an administrative portal and compliance verification system for medicine listings.

---

## 1. Product Overview & Objectives

### Problem Statement
Online pharmaceutical platforms require rigorous compliance checks to prevent the listing of illegal, counterfeit, expired, or improperly documented medicines. A manual verification workflow is necessary to review formulation, pricing, vendor credentials, and licenses before listings go live.

### Goal
MediApprove provides a secure, intuitive, and highly auditable platform for compliance officers and administrators to manage, verify, and track the lifecycle of medicine listings.

### Core Value Proposition
- **Structured Review Queues:** Streamlines the queue by categorizing listings into Pending, Approved, and Rejected states.
- **Focused Review Mode:** Displays pending listings one at a time to prevent cognitive fatigue and ensure thorough check-offs.
- **Tamper-Evident Audit Trails:** Guarantees absolute transparency and accountability for regulatory compliance.
- **Granular Access Control:** Restricts critical actions to authorized administrators only.

---

## 2. Target Audience & User Personas

| Persona | Role | Primary Goals | Key Pain Points |
| :--- | :--- | :--- | :--- |
| **System Administrator (ADMIN)** | Full access and approval privileges. | Efficiently audit pending queue, approve/reject listings, review action logs, manage notifications, and control account preferences. | Overwhelming review lists, lack of audit trails, account security threats. |
| **Compliance Officer / Staff (USER)** | Read-only access to pending queue and dashboard. | View dashboard metrics, monitor pending listings, check verification status. | Lack of clear queue status visibility. |

---

## 3. Functional Requirements

### 3.1. Authentication & Access Control (RBAC)
- **User Signup:** Allows users to register with Name, Email, Phone, and Password. Email addresses ending in `@mediapprove.com` are automatically granted `ADMIN` privileges; others default to `USER`.
- **User Login:** Authenticates credentials using secure passwords. Session tokens are stored in secure, `HttpOnly` cookies.
- **Session Revocation:**
  - **Standard Logout:** Destroys the current browser session.
  - **Global Logout (Logout All Devices):** Increments the user's database `tokenVersion`, invalidating all active JWT sessions across all devices.
- **Role-Based Restrictions:**
  - Standard users (`USER`) are restricted to the login/signup portal, dashboard home metrics, and basic profile views.
  - Administrators (`ADMIN`) have full access to pending, approved, and rejected queues, action logs, notifications, and profile settings.

### 3.2. Medicine Listing Queues
- **Pending Review Queue:**
  - Must display only listings with `PENDING` status.
  - **Paging Constraint:** Must display exactly **one listing per page** to allow focused review.
  - Controls: Next/Previous page buttons, and direct buttons to Approve or Reject the current listing.
- **Approved Workspace:**
  - Displays a detailed tabular view of all verified listings with status `APPROVED`.
  - Includes a details modal showing SKU, formulation, price, expiry date, vendor, and approval history.
- **Rejected Workspace:**
  - Displays a detailed tabular view of all listings with status `REJECTED`.
  - Includes a details modal showing the rejection reason and admin notes.

### 3.3. Review & Approval Workflows
- **Approval Workflow:**
  - Admin clicks "Approve".
  - Status updates to `APPROVED` in a transaction-safe manner.
  - Creates a permanent entry in the Audit Log mapping the admin ID, listing ID, action (`APPROVED`), and timestamp.
- **Rejection Workflow:**
  - Admin clicks "Reject".
  - Prompts admin to enter a mandatory **Rejection Reason** and optional notes.
  - Status updates to `REJECTED`.
  - Creates an entry in the Audit Log with the action (`REJECTED`).

### 3.4. Audit Logging
- **Centralized Action Log:**
  - Captures every administrative action (`APPROVED` / `REJECTED`).
  - Records the following parameters:
    - Target medicine listing details.
    - Admin ID and Name.
    - Action type.
    - IP address, OS, browser, and device details of the acting admin.
    - Timestamp.
- **Log Explorer:** Admins can view a paginated list of all system audit logs.

### 3.5. Notification System
- **Event Alerts:** Real-time feedback for key actions:
  - New medicine listing additions.
  - Approval and rejection decisions.
  - Security actions (password resets, global logouts).
- **Navigation Feed:** Access to a persistent notification drawer from any dashboard page.

### 3.6. Account Settings & Preferences
- **Preferences:** Global toggle to switch time formats between `12-hour` and `24-hour` clocks.
- **Profile Updates:** Allows updating contact details (Name, Phone).
- **Danger Zone:** Allow permanent account deletion, which cascadingly deletes associated user sessions.

---

## 4. Technical & Non-Functional Requirements

### 4.1. Security
- **Data Protection:** Passwords hashed using `bcrypt` (10 salt rounds).
- **Token Security:** Stateless JWT authentication stored in cookies with `HttpOnly`, `Secure`, and `SameSite=Lax` flags to mitigate XSS and CSRF risks.
- **Password Reset:** Secure hex-based forgot-password token hashing (SHA-256) with a short 15-minute expiration period.

### 4.2. Usability & Interface
- **Responsive Layout:** Responsive sidebar navigation and tables adapting dynamically to mobile, tablet, and desktop views.
- **Modals:** Form entries and item detail cards presented via responsive overlay modals.

### 4.3. Performance & Architecture
- **Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL (Neon Serverless).
- **Transaction Safety:** Review state changes and audit logging must execute inside single SQL transactions to prevent state desynchronization.

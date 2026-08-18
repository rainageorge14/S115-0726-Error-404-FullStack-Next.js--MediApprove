# JavaScript Concepts Integration Documentation

This document explains how five core JavaScript concepts are integrated and demonstrated inside the MediApprove application in a production-appropriate, clean, and maintainable manner.

---

## 1. Async/Await

### Where It Is Used
- In [`MedicineContext.tsx`](file:///c:/Users/raina/OneDrive/Desktop/Livebook/Projects/Project%20MediApprove/mediapprove/components/ui/MedicineContext.tsx):
  - `loadProfile()` inside `useEffect` (on mount)
  - `approveMedicine` and `rejectMedicine` workflows.
- Inside page components and API routes (e.g., [`profile/page.tsx`](file:///c:/Users/raina/OneDrive/Desktop/Livebook/Projects/Project%20MediApprove/mediapprove/app/dashboard/profile/page.tsx), [`signup/page.tsx`](file:///c:/Users/raina/OneDrive/Desktop/Livebook/Projects/Project%20MediApprove/mediapprove/app/signup/page.tsx), [`reset-password/page.tsx`](file:///c:/Users/raina/OneDrive/Desktop/Livebook/Projects/Project%20MediApprove/mediapprove/app/reset-password/page.tsx)).

### Why Used & Problem Solved
Async/Await provides a synchronous-looking syntactical wrapper around JavaScript Promises. It replaces nested Promise `.then()` and `.catch()` chains (which can lead to horizontal code nesting or callback-like patterns), making code highly linear, easy to read, and simple to debug.

Example from `loadProfile`:
```typescript
const loadProfile = async () => {
  try {
    const data = await fetchProfile();
    if (data.success && data.user && data.user.timeFormat) {
      // ... update state
    }
  } catch (e) {
    console.error("Failed to fetch settings from profile", e);
  }
};
```

---

## 2. Closures

### Exact File & Function
- File: [`lib/medicine-filters.ts`](file:///c:/Users/raina/OneDrive/Desktop/Livebook/Projects/Project%20MediApprove/mediapprove/lib/medicine-filters.ts)
- Function: `createMedicineFilter(criteria)` returning the inner function `filterMedicine(medicine)`.

### How It Works & Captured Variables
The factory function `createMedicineFilter` accepts a `criteria` configuration object and returns a specialized filtering function. The returned function (`filterMedicine`) acts as a **closure**: it retains lexical access to the `criteria` object declared in the outer scope, even after `createMedicineFilter` has finished executing.

```typescript
export function createMedicineFilter(criteria: FilterCriteria) {
  // Returned function captures `criteria` from the outer scope
  return function filterMedicine(medicine: Medicine): boolean {
    if (criteria.status && medicine.status !== criteria.status) {
      return false;
    }
    // ... search and other checks using criteria
    return true;
  };
}
```

### Why It Is Useful Here
Rather than writing duplicated inline filtering and search checks across the Pending, Approved, and Rejected medicine lists, we encapsulate the criteria matching rules in one place. By passing the returned closure directly to the Array `.filter()` method, the application preserves clean code, modular testing, and consistent filtering behavior.

---

## 3. Event Loop

### Existing Asynchronous Workflow
1. User clicks **Approve** or **Reject** in the medicine details modal.
2. The React event handler captures the user action and fires the async API call:
   ```typescript
   const handleApproveConfirm = async () => {
     setIsApproving(true); // 1. Updates loading state in React
     const success = await approveMedicine(id, adminName); // 2. Async API invocation (Promise-based)
     // ...
   };
   ```
3. During step 2, the async fetch operations are delegated to the browser's Web APIs container, freeing up the single execution thread of the **JavaScript Event Loop**.
4. The UI remains fully responsive. Users can see loading spinners on buttons, and other interactions (such as scrolling or opening settings) are not blocked.
5. Once the HTTP request resolves, the response is pushed to the **microtask queue**. The Event Loop picks it up when the call stack is empty, updating local states and triggering visual notifications.

---

## 4. Hoisting

### Exact File & Functions
- File: [`lib/medicine.ts`](file:///c:/Users/raina/OneDrive/Desktop/Livebook/Projects/Project%20MediApprove/mediapprove/lib/medicine.ts)
- Function Declarations: `getMedicineStatusLabel` calling `formatStatus` and `isMedicineExpired` calling `parseExpiryToDate`.

### How It Demonstrates Hoisting
The file exports utility functions that reference helper functions defined lower down in the file:
```typescript
export function getMedicineStatusLabel(status: string): string {
  // formatStatus is executed here before it is physically defined below
  return formatStatus(status);
}

// Function declaration is hoisted to the top of the scope
function formatStatus(status: string): string {
  // ...
}
```
In JavaScript, **function declarations** are fully hoisted during the compilation phase, meaning they are loaded into memory and available for execution anywhere in their enclosing scope. This enables writing clean, structured code where top-level API functions are placed at the beginning of files for developers to read, while secondary utility helpers are kept at the bottom.

---

## 5. Promises vs Callbacks

### Where Promise is Used
- In [`lib/api.ts`](file:///c:/Users/raina/OneDrive/Desktop/Livebook/Projects/Project%20MediApprove/mediapprove/lib/api.ts):
  ```typescript
  export function fetchProfile(): Promise<ProfileResponse> {
    return fetch("/api/profile")
      .then((response) => {
        if (!response.ok) throw new Error("...");
        return response.json();
      });
  }
  ```
  This creates a clean Promise abstraction for client-server communication.

### Where Callbacks are Used
- React event listeners: `onClick`, `onChange` (e.g. `onChange={(e) => setSearchQuery(e.target.value)}`).
- Array operations: `map()`, `filter()`, `find()` (e.g. `medicines.filter((m) => m.status === "pending")`).
- Timer functions: `setTimeout` and `clearTimeout` for toast resets.

### Comparison
While callbacks are excellent for synchronous tasks (like processing array elements or responding to user clicks), they are difficult to manage for sequential asynchronous tasks. Combining nested callbacks for network requests results in "callback hell," which hurts code quality and error tracking. Modern Promise-based APIs combined with `async/await` allow asynchronous code to be written cleanly and sequentially.

/**
 * Promise-based API Utility Library
 * 
 * Demonstrates a clean Promise-based abstraction for API communication.
 * This separates network fetch details and JSON parsing from the component/context level,
 * returning clean Promises that can be handled using async/await.
 */

export interface ProfileResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    timeFormat: "12h" | "24h";
  };
}

export interface ApproveResponse {
  success: boolean;
  message?: string;
  admin?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RejectResponse {
  success: boolean;
  message?: string;
  admin?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Fetch current user settings profile.
 * Returns a Promise that resolves to ProfileResponse.
 */
export function fetchProfile(): Promise<ProfileResponse> {
  return fetch("/api/profile")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch profile settings");
      }
      return response.json();
    });
}

/**
 * Sends a PATCH request to approve a medicine listing in the database.
 * Returns a Promise that resolves to ApproveResponse.
 */
export function approveMedicineApi(id: string): Promise<ApproveResponse> {
  return fetch(`/api/medicines/${id}/approve`, {
    method: "PATCH",
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to approve medicine listing: ${response.statusText}`);
    }
    return response.json();
  });
}

/**
 * Sends a PATCH request to reject a medicine listing in the database with reasons.
 * Returns a Promise that resolves to RejectResponse.
 */
export function rejectMedicineApi(
  id: string,
  reason: string,
  notes?: string
): Promise<RejectResponse> {
  return fetch(`/api/medicines/${id}/reject`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason, notes }),
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to reject medicine listing: ${response.statusText}`);
    }
    return response.json();
  });
}

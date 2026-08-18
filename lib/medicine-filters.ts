import { Medicine } from "@/components/ui/MedicineContext";

export interface FilterCriteria {
  searchQuery?: string;
  category?: string; // "All" or specific category
  company?: string; // "All" or specific company
  status?: "pending" | "approved" | "rejected";
}

/**
 * Creates a medicine filter function (closure) based on the provided criteria.
 * The returned function retains access to the `criteria` object from its outer lexical scope.
 * 
 * Demonstrates: JavaScript Closures
 */
export function createMedicineFilter(criteria: FilterCriteria) {
  // The returned function is a closure that captures and remembers `criteria`
  return function filterMedicine(medicine: Medicine): boolean {
    // 1. Filter by Status if specified
    if (criteria.status && medicine.status !== criteria.status) {
      return false;
    }

    // 2. Filter by Category
    if (
      criteria.category &&
      criteria.category !== "All" &&
      medicine.category !== criteria.category
    ) {
      return false;
    }

    // 3. Filter by Company
    if (
      criteria.company &&
      criteria.company !== "All" &&
      medicine.company !== criteria.company
    ) {
      return false;
    }

    // 4. Search Query matching
    if (criteria.searchQuery) {
      const searchLower = criteria.searchQuery.toLowerCase();
      const nameStr = (medicine.name || medicine.medicineName || "").toLowerCase();
      const companyStr = (medicine.company || "").toLowerCase();
      const categoryStr = (medicine.category || "").toLowerCase();
      const batchStr = (medicine.batchNumber || medicine.batch || "").toLowerCase();
      const reasonStr = (medicine.rejectionReason || "").toLowerCase();

      // Implement status-specific search rules to match existing application logic exactly
      if (criteria.status === "rejected") {
        const matchesSearch =
          nameStr.includes(searchLower) ||
          companyStr.includes(searchLower) ||
          batchStr.includes(searchLower) ||
          reasonStr.includes(searchLower);
        if (!matchesSearch) return false;
      } else if (criteria.status === "approved") {
        const matchesSearch =
          nameStr.includes(searchLower) ||
          companyStr.includes(searchLower) ||
          categoryStr.includes(searchLower) ||
          batchStr.includes(searchLower);
        if (!matchesSearch) return false;
      } else {
        // Pending status search matches medicine name or company
        const matchesSearch =
          nameStr.includes(searchLower) ||
          companyStr.includes(searchLower);
        if (!matchesSearch) return false;
      }
    }

    return true;
  };
}

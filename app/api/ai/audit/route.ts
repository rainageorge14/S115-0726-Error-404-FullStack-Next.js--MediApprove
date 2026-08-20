import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";

// Schema definition matching what we request from Gemini
interface GeminiAuditOutput {
  isCompliant: boolean;
  recommendation: "APPROVE" | "REJECT";
  reason: string;
  safetyConcerns: string[];
  extractedChemicals: string[];
  flags: string[];
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check (using getAuthenticatedAdmin helper)
    // We allow standard users or admins to run audit for educational review, 
    // but we can double check general session presence.
    // If not authenticated, return 401 Unauthorized
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Please sign in to perform audits.",
        },
        { status: 401 }
      );
    }

    // 2. Read Request Body
    const body = await req.json().catch(() => ({}));
    const { medicineName, sku, formulation, price, expiryDate, vendor, description, composition } = body;

    // Validate minimum required fields
    if (!medicineName || !formulation) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: medicineName and formulation are required.",
        },
        { status: 400 } // 400 Bad Request
      );
    }

    // 3. API Key check
    // Look for GEMINI_API_KEY in process.env or x-gemini-key header (for front-end user customization override)
    const clientKey = req.headers.get("x-gemini-key");
    const apiKey = clientKey || process.env.GEMINI_API_KEY;

    // We build the Prompt Engineering parts
    const systemInstruction = 
      "You are an expert pharmaceutical auditor verifying medicine listings for safety, pricing, correct clinical naming, and cataloging compliance. " +
      "Analyze the medicine details provided and return a structured JSON report specifying compliance status, recommended action, " +
      "safety concerns (e.g. potential interactions, contraindications, high dosage), extracted chemical compounds, and any flags " +
      "(e.g. suspicious pricing, expired dates, invalid SKU formats).";

    const userPrompt = `
      Please audit the following medicine listing:
      - Medicine Name: ${medicineName}
      - Vendor/Company: ${vendor || "Unknown"}
      - Formulation: ${formulation}
      - Composition: ${composition || "Not specified"}
      - Price: $${price || "0.00"}
      - Expiry Date: ${expiryDate || "Not specified"}
      - SKU Code: ${sku || "Not specified"}
      - Description: ${description || "No description provided"}
      
      Auditing Criteria:
      1. Verify if the Price is non-zero and realistic for pharmaceutical items.
      2. Check if the Expiry Date has passed (Current Date: ${new Date().toISOString().split("T")[0]}). Expired items are non-compliant.
      3. Verify if Formulation matches standard clinical standards (contains dosage, form, active compound).
      4. List any chemical compounds or active pharmaceutical ingredients (APIs).
      5. Call out safety alerts if it contains heavy sedatives, high risk compounds, or lacks descriptive contents.
    `;

    // If key is configured, perform real Gemini request
    if (apiKey && apiKey.trim() !== "" && apiKey.trim() !== "undefined") {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: `${systemInstruction}\n\n${userPrompt}` }
                  ]
                }
              ],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: "OBJECT",
                  properties: {
                    isCompliant: { type: "BOOLEAN" },
                    recommendation: { type: "STRING", enum: ["APPROVE", "REJECT"] },
                    reason: { type: "STRING" },
                    safetyConcerns: {
                      type: "ARRAY",
                      items: { type: "STRING" }
                    },
                    extractedChemicals: {
                      type: "ARRAY",
                      items: { type: "STRING" }
                    },
                    flags: {
                      type: "ARRAY",
                      items: { type: "STRING" }
                    }
                  },
                  required: ["isCompliant", "recommendation", "reason", "safetyConcerns", "extractedChemicals", "flags"]
                }
              }
            }),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API responded with status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
          throw new Error("Empty response returned from Gemini API model.");
        }

        const auditResult: GeminiAuditOutput = JSON.parse(textResponse);

        return NextResponse.json({
          success: true,
          isMock: false,
          systemInstruction,
          prompt: userPrompt,
          rawJson: auditResult,
          statusCode: 200,
        });

      } catch (geminiError: unknown) {
        console.error("Gemini Audit Error, falling back to local audit:", geminiError);
        const err = geminiError as Error;
        // We will fall back to local validation but indicate there was a Gemini API error
        const localAudit = runLocalAudit(medicineName, sku, formulation, price, expiryDate, vendor, composition);
        return NextResponse.json({
          success: true,
          isMock: true,
          error: err.message || "Failed to contact Gemini API. Running local fallback audit.",
          systemInstruction,
          prompt: userPrompt,
          rawJson: localAudit,
          statusCode: 200,
        });
      }
    } else {
      // 4. Fallback Mock Auditor (Satisfying Prompt & Structured output parameters offline)
      const localAudit = runLocalAudit(medicineName, sku, formulation, price, expiryDate, vendor, composition);

      return NextResponse.json({
        success: true,
        isMock: true,
        message: "Offline Sandbox Audit: No GEMINI_API_KEY configured. Running local deterministic validation logic.",
        systemInstruction,
        prompt: userPrompt,
        rawJson: localAudit,
        statusCode: 200,
      });
    }

  } catch (error: unknown) {
    console.error("Audit listing route error:", error);
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal Server Error during audit processing",
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

// Local mock auditor logic reproducing structured outputs deterministically
function runLocalAudit(
  medicineName: string,
  sku: string | undefined,
  formulation: string,
  price: number | undefined,
  expiryDate: string | undefined,
  vendor: string | undefined,
  composition: string | undefined
): GeminiAuditOutput {
  const flags: string[] = [];
  const safetyConcerns: string[] = [];
  const extractedChemicals: string[] = [];

  // Parse composition for compounds
  if (composition) {
    const parts = composition.split(/[,+]/).map(c => c.trim().replace(/\d+\s*(mg|g|mcg|ml|%)/gi, ""));
    parts.forEach(p => {
      if (p.length > 2 && !extractedChemicals.includes(p)) {
        extractedChemicals.push(p);
      }
    });
  } else {
    // Default chemical extract from name
    extractedChemicals.push(medicineName.split(" ")[0]);
  }

  // 1. SKU validation
  if (!sku || sku.trim() === "") {
    flags.push("MISSING_SKU");
  } else if (!/^[A-Z0-9-]{4,12}$/i.test(sku)) {
    flags.push("SUSPICIOUS_SKU_FORMAT");
  }

  // 2. Price check
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    flags.push("INVALID_PRICE_ZERO_OR_NEGATIVE");
    safetyConcerns.push("Pricing verification failed. Zero or negative price listings might represent sample distribution or clerical errors.");
  } else if (numPrice > 500) {
    flags.push("HIGH_PRICE_ALERT");
    safetyConcerns.push("Price exceeds normal consumer bounds ($500+). Requires manual invoice/wholesale documentation review.");
  }

  // 3. Expiry date check
  if (expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < today) {
      flags.push("EXPIRED_PRODUCT");
      safetyConcerns.push(`Product has expired as of ${expiryDate}. Distribution of expired pharmaceuticals violates compliance regulations.`);
    } else {
      const diffTime = Math.abs(expiry.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 90) {
        flags.push("NEAR_EXPIRY");
        safetyConcerns.push(`Product expires in ${diffDays} days. Listings with less than 90 days validity require warning banners.`);
      }
    }
  }

  // 4. Formulation checks
  const standardFormulation = formulation.toLowerCase();
  const forms = ["tablet", "capsule", "syrup", "injection", "ointment", "cream", "gel", "suspension", "drops", "infusion"];
  const hasForm = forms.some(f => standardFormulation.includes(f));
  if (!hasForm) {
    flags.push("NON_STANDARD_FORMULATION");
    safetyConcerns.push("Formulation entry does not specify standard administration forms (e.g. tablet, capsule, injection).");
  }

  // 5. Add chemicals-based safety flags
  const lowerName = medicineName.toLowerCase();
  if (lowerName.includes("codeine") || lowerName.includes("tramadol") || lowerName.includes("morphine")) {
    flags.push("CONTROLLED_SUBSTANCE");
    safetyConcerns.push("Contains controlled opiate derivatives. Requires strict DEA credentials and prescription enforcement verification.");
  }
  if (lowerName.includes("xanax") || lowerName.includes("alprazolam") || lowerName.includes("diazepam")) {
    flags.push("PSYCHOTROPIC_SUBSTANCE");
    safetyConcerns.push("Benzodiazepine detected. High abuse potential. Verify double-signoff licensing protocols.");
  }

  const isCompliant = flags.filter(f => f === "EXPIRED_PRODUCT" || f === "INVALID_PRICE_ZERO_OR_NEGATIVE").length === 0;
  const recommendation = isCompliant ? "APPROVE" : "REJECT";
  const reason = isCompliant
    ? `Medicine ${medicineName} meets basic catalog compliance standards. Formulation, SKU syntax, and pricing ($${price || "0"}) look legitimate.`
    : `Medicine listing contains compliance failures: ${flags.join(", ")}. Rejection recommended.`;

  return {
    isCompliant,
    recommendation,
    reason,
    safetyConcerns,
    extractedChemicals,
    flags
  };
}

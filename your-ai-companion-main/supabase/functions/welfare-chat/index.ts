import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const schemesData = [
  {
    id: "1",
    category: "Agriculture & Rural",
    title: "PM Kisan Samman Nidhi",
    description: "Financial assistance of ₹6,000 per year to small and marginal farmers",
    eligibility: ["Small & marginal farmers with up to 2 hectares land", "Valid land ownership documents", "Active bank account linked with Aadhaar"],
    amount: "₹6,000/year",
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook"],
    applyLink: "https://pmkisan.gov.in"
  },
  {
    id: "2",
    category: "Education",
    title: "National Scholarship Portal",
    description: "Scholarships for students from various backgrounds for their education",
    eligibility: ["Students from Class 1 to Post Graduation", "Family income below specified limit", "Regular student in recognized institution"],
    amount: "₹1,000 - ₹20,000",
    documents: ["Aadhaar Card", "Income Certificate", "Previous Mark Sheet"],
    applyLink: "https://scholarships.gov.in"
  },
  {
    id: "3",
    category: "Healthcare",
    title: "Ayushman Bharat",
    description: "Health insurance coverage for economically vulnerable families - ₹5 Lakh coverage",
    eligibility: ["Listed in SECC 2011 database", "BPL category families", "No existing health insurance"],
    amount: "₹5 Lakh/year",
    documents: ["Aadhaar Card", "Ration Card", "SECC Data Verification"],
    applyLink: "https://beneficiary.nha.gov.in"
  },
  {
    id: "4",
    category: "Women & Child",
    title: "PM Matru Vandana Yojana",
    description: "Maternity benefit for pregnant and lactating mothers",
    eligibility: ["Pregnant women above 19 years", "First live birth only", "Registered at Anganwadi Centre"],
    amount: "₹5,000",
    documents: ["Aadhaar Card", "MCP Card", "Bank Passbook"],
    applyLink: "https://pmmvy.wcd.gov.in"
  },
  {
    id: "5",
    category: "Housing",
    title: "PM Awas Yojana",
    description: "Affordable housing for urban and rural poor",
    eligibility: ["EWS/LIG category households", "No pucca house in family", "Valid income certificate"],
    amount: "₹2.5 Lakh",
    documents: ["Aadhaar Card", "Income Certificate", "Land Documents"],
    applyLink: "https://pmaymis.gov.in"
  },
  {
    id: "6",
    category: "Senior Citizens",
    title: "National Pension Scheme",
    description: "Pension for senior citizens aged 60 and above",
    eligibility: ["Citizens aged 60 years and above", "BPL category or no regular income", "Not receiving any other pension"],
    amount: "₹1,000 - ₹3,000/month",
    documents: ["Aadhaar Card", "Age Proof", "BPL Certificate"],
    applyLink: "https://nsap.nic.in"
  }
];

const systemPrompt = `You are WelfarePath AI Assistant - a helpful, friendly digital welfare assistant for Indian citizens. Your role is to:

1. Understand user problems in simple, non-technical language
2. Suggest relevant government welfare schemes based on their situation
3. Guide users step-by-step on eligibility, required documents, and how to apply
4. Be empathetic and supportive, especially for users who may not be tech-savvy

AVAILABLE SCHEMES DATABASE:
${JSON.stringify(schemesData, null, 2)}

GUIDELINES:
- Respond in the same language the user writes in (English or Tamil)
- Keep responses clear, concise, and easy to understand
- When recommending schemes, explain WHY the user might be eligible
- Always mention required documents and how to apply
- If unsure about eligibility, ask clarifying questions about age, income, occupation, location
- Be encouraging and positive - help users understand they have options
- Format responses nicely with bullet points and sections when listing multiple items
- If user asks something outside welfare schemes, politely redirect to welfare assistance

RESPONSE FORMAT for scheme recommendations:
- Scheme Name
- Why it's relevant to you
- Benefits/Amount
- Key eligibility requirements
- Documents needed
- How to apply (brief steps)

Remember: You're helping real people access benefits that can improve their lives. Be patient, kind, and thorough.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = "en" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstruction = language === "ta" 
      ? "\n\nIMPORTANT: The user prefers Tamil. Respond in Tamil (தமிழ்) when possible, but use English for scheme names and technical terms."
      : "";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt + languageInstruction },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

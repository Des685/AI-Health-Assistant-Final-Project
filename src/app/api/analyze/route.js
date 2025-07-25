import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

// Your diagnosis data
const DIAGNOSES = [
  {
    name: "Common Cold",
    symptoms: ["Runny nose", "Cough", "Sore throat", "Congestion", "Fatigue"],
    description: "A viral infection of the upper respiratory tract",
    remedies: [
      "Get plenty of rest (7-9 hours of sleep)",
      "Stay hydrated with water, herbal teas, and warm broths",
      "Use a humidifier or breathe steam from hot shower",
      "Gargle with warm salt water for sore throat",
      "Consider over-the-counter pain relievers if needed",
    ],
    severity: "Mild",
    duration: "7-10 days",
    icon: "🤧",
  },
  // ... add other diagnoses here
]

export async function POST(request) {
  try {
    const { symptoms } = await request.json()

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 })
    }

    // Get user from token (optional - works for both authenticated and anonymous users)
    let userId = null
    const token = request.cookies.get("auth-token")?.value

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        userId = decoded.userId
      }
    }

    // Perform analysis
    const results = DIAGNOSES.map((diagnosis) => {
      const matchingSymptoms = diagnosis.symptoms.filter((symptom) => symptoms.includes(symptom))
      const confidence = (matchingSymptoms.length / diagnosis.symptoms.length) * 100

      return {
        ...diagnosis,
        confidence: Math.round(confidence),
        matchingSymptoms,
      }
    })
      .filter((diagnosis) => diagnosis.confidence > 0)
      .sort((a, b) => b.confidence - a.confidence)

    // Save session to database if user is authenticated
    let sessionId = null
    if (userId) {
      const session = await prisma.session.create({
        data: {
          userId,
          symptoms: JSON.stringify(symptoms),
          results: JSON.stringify(results),
        },
      })
      sessionId = session.id
    }

    return NextResponse.json({
      success: true,
      results,
      sessionId,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

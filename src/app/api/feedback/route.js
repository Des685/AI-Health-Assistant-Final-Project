import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { sessionId, diagnosisName, helped, feedback } = await request.json()

    // Get user from token
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Update session with feedback
    const updatedSession = await prisma.session.update({
      where: {
        id: sessionId,
        userId: decoded.userId, // Ensure user owns this session
      },
      data: {
        feedback: JSON.stringify({
          diagnosisName,
          helped,
          feedback,
          timestamp: new Date().toISOString(),
        }),
        completed: helped,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      session: updatedSession,
    })
  } catch (error) {
    console.error("Feedback error:", error)
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
  }
}

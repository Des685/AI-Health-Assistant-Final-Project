import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(request) {
  try {
    // Get user from token
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user's sessions
    const sessions = await prisma.session.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
      take: 10, // Limit to last 10 sessions
    })

    // Parse JSON strings back to objects
    const formattedSessions = sessions.map((session) => ({
      ...session,
      symptoms: JSON.parse(session.symptoms),
      results: JSON.parse(session.results),
      feedback: session.feedback ? JSON.parse(session.feedback) : null,
    }))

    return NextResponse.json({
      success: true,
      sessions: formattedSessions,
    })
  } catch (error) {
    console.error("Sessions error:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

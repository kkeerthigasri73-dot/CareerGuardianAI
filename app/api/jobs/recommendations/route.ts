import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CareerDNA from "@/models/CareerDNA";
import JobOpportunity from "@/models/JobOpportunity";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import { matchJob } from "@/lib/jobMatcher";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = token ? verifyToken(token) as { id?: string } | null : null;
    if (!decoded?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await connectDB();

    const [career, user] = await Promise.all([
      CareerDNA.findOne({ userId: decoded.id }).sort({ createdAt: -1 }).lean(),
      User.findById(decoded.id).select("jobNotificationPreferences").lean(),
    ]);
    const preferences = career?.jobPreferences || { minimumMatchScore: 60 };
    const minimumMatchScore = Math.max(preferences.minimumMatchScore ?? 60, user?.jobNotificationPreferences?.minimumMatchScore ?? 60);
    const jobs = await JobOpportunity.find({ isActive: true, $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }] }).sort({ postedAt: -1 }).lean();
    const recommended = jobs.map((job) => ({ ...job, ...matchJob(job, preferences, career || {}) })).filter((job) => job.matchScore >= minimumMatchScore).sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ success: true, jobs: recommended });
  } catch (error) {
    console.error("Job recommendations error:", error);
    return NextResponse.json({ success: false, message: "Unable to load job recommendations" }, { status: 500 });
  }
}

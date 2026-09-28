import { NextResponse } from "next/server";

import { verifyDomain } from "@/lib/live/domain";
import { verifyEmail } from "@/lib/live/email";
import { verifyHTTPS } from "@/lib/live/https";
import { verifyGovernment } from "@/lib/live/government";
import { detectScam } from "@/lib/live/scam";

import connectDB from "@/lib/mongodb";

import Verification from "@/models/Verification";
import User from "@/models/User";

import { calculateBadges } from "@/lib/badges";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      company,
      website,
      email,
      phone,
      salary,
      notificationNumber,
      applicationFee,
      education,
      jobRole,
      description,
      userId,
    } = body;

    const layers: any[] = [];

    // =========================
    // LAYER 1 - OCR EXTRACTION
    // =========================

    layers.push({
      layer: 1,
      title: "OCR Extraction",
      passed: !!company,
      score: company ? 10 : 0,
      message: company
        ? "Recruitment information extracted."
        : "OCR extraction failed.",
    });

    // ==================================
    // LAYER 2 - ORGANIZATION VERIFICATION
    // ==================================

    const government = verifyGovernment(
      company || "",
      notificationNumber || ""
    );

    const isPrivateRecruitment =
      government.message
        .toLowerCase()
        .includes("private");

    layers.push({
      layer: 2,
      title: "Organization Verification",
      passed:
        government.passed ||
        isPrivateRecruitment,
      score: government.passed
        ? government.score
        : isPrivateRecruitment
        ? 5
        : 0,
      message: government.passed
        ? government.message
        : isPrivateRecruitment
        ? "Private Company Recruitment"
        : government.message,
    });

    // ==============================
    // LAYER 3 - WEBSITE VERIFICATION
    // ==============================

    const domain = await verifyDomain(
      website || ""
    );

    layers.push({
      layer: 3,
      title: "Website Verification",
      passed: domain.passed,
      score: domain.score,
      message: domain.message,
    });

    // ============================
    // LAYER 4 - EMAIL VERIFICATION
    // ============================

    const emailResult = verifyEmail(
      email || ""
    );

    layers.push({
      layer: 4,
      title: "Recruiter Email",
      passed: emailResult.passed,
      score: emailResult.score,
      message: emailResult.message,
    });

    // ============================
    // LAYER 5 - PHONE VERIFICATION
    // ============================

    const cleanedPhone = (phone || "")
      .replace(/[^\d+]/g, "")
      .replace(/^\+91/, "")
      .replace(/^91/, "");

    const isMobile =
      /^[6-9]\d{9}$/.test(cleanedPhone);

    const isLandline =
      /^\d{10,11}$/.test(cleanedPhone);

    const phoneValid =
      isMobile || isLandline;

    layers.push({
      layer: 5,
      title: "Phone Verification",
      passed: phoneValid,
      score: phoneValid ? 10 : 0,
      message: phoneValid
        ? isMobile
          ? "Valid Indian Mobile Number"
          : "Valid Office Contact Number"
        : phone
        ? "Contact Number Requires Review"
        : "Official Phone Not Mentioned",
    });

    // ===========================
    // LAYER 6 - SALARY ANALYSIS
    // ===========================

    const salaryText =
      (salary || "").trim();

    const salaryValues =
      salaryText.match(/\d[\d,]*/g);

    if (
      !salaryText ||
      !salaryValues ||
      salaryValues.length === 0
    ) {
      layers.push({
        layer: 6,
        title: "Salary Analysis",
        passed: true,
        score: 5,
        message:
          "Salary Not Mentioned — No Risk Detected",
      });
    } else {
      const firstSalary = Number(
        salaryValues[0].replace(
          /,/g,
          ""
        )
      );

      const realisticSalary =
        firstSalary >= 10000 &&
        firstSalary <= 300000;

      layers.push({
        layer: 6,
        title: "Salary Analysis",
        passed: realisticSalary,
        score: realisticSalary
          ? 10
          : 0,
        message: realisticSalary
          ? "Salary Range Appears Reasonable"
          : "Salary Requires Review",
      });
    }

    // ==============================
    // LAYER 7 - SCAM KEYWORD CHECK
    // ==============================

    const scam = detectScam(
      description || ""
    );

    layers.push({
      layer: 7,
      title: "Scam Keyword Detection",
      passed: scam.passed,
      score: scam.score,
      message: scam.message,
    });

    // =========================
    // LAYER 8 - HTTPS SECURITY
    // =========================

    const https = verifyHTTPS(
      website || ""
    );

    layers.push({
      layer: 8,
      title: "HTTPS Security",
      passed: https.passed,
      score: https.score,
      message: https.message,
    });

    // ==========================
    // LAYER 9 - APPLICATION FEE
    // ==========================

    const feeAmount = Number(
      (applicationFee || "").replace(
        /[^\d]/g,
        ""
      )
    );

    const feeAcceptable =
      feeAmount === 0 ||
      feeAmount <= 1000;

    layers.push({
      layer: 9,
      title: "Application Fee",
      passed: feeAcceptable,
      score: feeAcceptable ? 10 : 0,
      message: applicationFee
        ? `Application Fee ₹${feeAmount}`
        : "No Fee Mentioned",
    });

    // ===========================
    // LAYER 10 - EDUCATION CHECK
    // ===========================

    layers.push({
      layer: 10,
      title: "Education Verification",
      passed: !!education,
      score: education ? 5 : 0,
      message:
        education ||
        "Education not found.",
    });

    // ==========================
    // LAYER 11 - JOB ROLE CHECK
    // ==========================

    layers.push({
      layer: 11,
      title: "Job Role Verification",
      passed: !!jobRole,
      score: jobRole ? 5 : 0,
      message:
        jobRole ||
        "Job role not found.",
    });

    // ======================
    // CALCULATE TRUST SCORE
    // ======================

    const totalScore = layers.reduce(
      (sum, layer) =>
        sum + Number(layer.score || 0),
      0
    );

    const trustScore = Math.min(
      Math.round(totalScore),
      100
    );

    let verdict = "SCAM";

    if (trustScore >= 80) {
      verdict = "SAFE";
    } else if (trustScore >= 60) {
      verdict = "SUSPICIOUS";
    }

    // ==========================
    // LAYER 12 - FINAL AI SCORE
    // ==========================

    layers.push({
      layer: 12,
      title: "AI Final Trust Score",
      passed: trustScore >= 60,
      score: trustScore,
      message: `${trustScore}% Trust Score`,
    });

    // ====================
    // CONNECT DATABASE
    // ====================

    await connectDB();

    // ==========================
    // SAVE VERIFICATION RECORD
    // ==========================

    await Verification.create({
      userId: userId || "demo-user",

      company: company || "",

      jobRole: jobRole || "",

      trustScore,

      status: verdict,

      layers,

      website: website || "",

      email: email || "",

      phone: phone || "",

      salary: salary || "",

      notificationNumber:
        notificationNumber || "",

      applicationFee:
        applicationFee || "",

      education:
        education || "",

      description:
        description || "",
    });

    // ==========================
    // UPDATE USER BADGES
    // ==========================

    let unlockedBadges: string[] = [];

    if (userId) {
      const user =
        await User.findById(userId);

      if (user) {
        // Increase completed verification count
        user.verificationCount =
          Number(
            user.verificationCount || 0
          ) + 1;

        // Calculate earned badges
        unlockedBadges =
          calculateBadges(user);

        // Save badges
        user.badges =
          unlockedBadges;

        await user.save();
      }
    }

    // =====================
    // RETURN FINAL RESULT
    // =====================

    return NextResponse.json({
      success: true,

      trustScore,

      verdict,

      layers,

      unlockedBadges,
    });

  } catch (error) {
    console.error(
      "Verification Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Verification failed.",
      },
      {
        status: 500,
      }
    );
  }
}
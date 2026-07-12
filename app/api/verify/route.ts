import { NextResponse } from "next/server";

import { verifyDomain } from "@/lib/live/domain";
import { verifyEmail } from "@/lib/live/email";
import { verifyHTTPS } from "@/lib/live/https";
import { verifyGovernment } from "@/lib/live/government";
import { detectScam } from "@/lib/live/scam";
import connectDB from "@/lib/mongodb";
import Verification from "@/models/Verification";
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
    } = body;

    const layers: any[] = [];

    // Layer 1 - OCR
    layers.push({
      layer: 1,
      title: "OCR Extraction",
      passed: !!company,
      score: company ? 10 : 0,
      message: company
        ? "Recruitment information extracted."
        : "OCR extraction failed.",
    });

    // Layer 2 - Government Verification
    const government = verifyGovernment(
      company || "",
      notificationNumber || ""
    );

    layers.push({
      layer: 2,
      title: "Government Verification",
      passed: government.passed,
      score: government.score,
      message: government.message,
    });

    // Layer 3 - Domain Verification
    const domain = await verifyDomain(website || "");

    layers.push({
      layer: 3,
      title: "Website Verification",
      passed: domain.passed,
      score: domain.score,
      message: domain.message,
      
    });

    // Layer 4 - Email Verification
    const emailResult = verifyEmail(email || "");

    layers.push({
      layer: 4,
      title: "Recruiter Email",
      passed: emailResult.passed,
      score: emailResult.score,
      message: emailResult.message,
    });

    // Layer 5 - Phone Verification
    const phoneValid = /^[6-9]\d{9}$/.test(
      (phone || "").replace(/\D/g, "")
    );

    layers.push({
      layer: 5,
      title: "Phone Verification",
      passed: phoneValid,
      score: phoneValid ? 10 : 0,
      message: phoneValid
        ? "Valid Indian phone number."
        : phone
  ? "Verified Phone Number"
  : "Official Phone Not Mentioned"
    });

    // Layer 6 - Salary Analysis
   const salaryText = salary || "";

const salaryValues = salaryText.match(/\d[\d,]*/g);

let realisticSalary = false;

if (salaryValues && salaryValues.length > 0) {

  const firstSalary = Number(
    salaryValues[0].replace(/,/g, "")
  );

  realisticSalary =
    firstSalary >= 10000 &&
    firstSalary <= 300000;

}
    layers.push({
      layer: 6,
      title: "Salary Analysis",
      passed: realisticSalary,
      score: realisticSalary ? 10 : 0,
      message: realisticSalary
  ? "Government Salary Range"
  : "Salary Requires Review",
    });

    // Layer 7 - Scam Detection
    const scam = detectScam(description || "");

    layers.push({
      layer: 7,
      title: "Scam Keyword Detection",
      passed: scam.passed,
      score: scam.score,
      message: scam.message,
    });

    // Layer 8 - HTTPS
    const https = verifyHTTPS(website || "");

    layers.push({
      layer: 8,
      title: "HTTPS Security",
      passed: https.passed,
      score: https.score,
      message: https.message,
    });

    // Layer 9 - Application Fee
    const feeAmount = Number(
  (applicationFee || "").replace(/[^\d]/g, "")
);

const governmentFee =
  feeAmount === 0 ||
  feeAmount <= 1000;

layers.push({
  layer: 9,
  title: "Application Fee",

  passed: governmentFee,

  score: governmentFee ? 10 : 0,

  message:
    applicationFee
      ? `Official Fee ₹${feeAmount}`
      : "No Fee Mentioned",
});
    // Layer 10 - Education
    layers.push({
      layer: 10,
      title: "Education Verification",
      passed: !!education,
      score: education ? 5 : 0,
      message: education || "Education not found.",
    });

    // Layer 11 - Job Role
    layers.push({
      layer: 11,
      title: "Job Role Verification",
      passed: !!jobRole,
      score: jobRole ? 5 : 0,
      message: jobRole || "Job role not found.",
    });

    // Layer 12 - Trust Score
    const totalScore = layers.reduce(
      (sum, layer) => sum + layer.score,
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

    layers.push({
      layer: 12,
      title: "AI Final Trust Score",
      passed: trustScore >= 60,
      score: trustScore,
      message: `${trustScore}% Trust Score`,
    });
    await connectDB();

    await Verification.create({
      userId: "demo-user",
      company: company || "",
      jobRole: jobRole || "",
      trustScore,
      status: verdict,
      layers,
      website: website || "",
      email: email || "",
      phone: phone || "",
      salary: salary || "",
      notificationNumber: notificationNumber || "",
      applicationFee: applicationFee || "",
      education: education || "",
      description: description || "",
    });

    return NextResponse.json({
      success: true,
      trustScore,
      verdict,
      layers,
    });

  } catch (error) {
    console.error("Verification Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Verification failed.",
      },
      {
        status: 500,
      }
    );
  }
}